const DB_NAME = 'k9crypt-status';
const DB_VERSION = 1;
const STORE_NAME = 'kv';
const OPEN_TIMEOUT_MS = 4000;

let db: IDBDatabase | null = null;
let dbPromise: Promise<IDBDatabase | null> | null = null;
const memStore = new Map<string, unknown>();

function open(): Promise<IDBDatabase | null> {
	if (db) return Promise.resolve(db);
	if (dbPromise) return dbPromise;

	dbPromise = new Promise((resolve) => {
		if (typeof indexedDB === 'undefined') {
			resolve(null);
			return;
		}

		let request: IDBOpenDBRequest;
		try {
			request = indexedDB.open(DB_NAME, DB_VERSION);
		} catch {
			resolve(null);
			return;
		}

		// Safari has shipped versions where open() neither succeeds nor fails;
		// fall back to memory instead of hanging forever.
		const timer = setTimeout(() => resolve(null), OPEN_TIMEOUT_MS);

		request.onupgradeneeded = () => {
			const database = request.result;
			if (!database.objectStoreNames.contains(STORE_NAME)) {
				database.createObjectStore(STORE_NAME);
			}
		};

		request.onsuccess = () => {
			clearTimeout(timer);
			const database = request.result;

			// another tab upgrading the DB asks us to close; reopen next call
			database.onversionchange = () => {
				database.close();
				db = null;
				dbPromise = null;
			};

			db = database;
			resolve(database);
		};

		request.onerror = () => {
			clearTimeout(timer);
			resolve(null);
		};

		request.onblocked = () => {
			clearTimeout(timer);
			resolve(null);
		};
	});

	return dbPromise;
}

// wait for a read to settle; any failure yields undefined
function readValue(database: IDBDatabase, key: string): Promise<unknown | undefined> {
	return new Promise<unknown | undefined>((resolve) => {
		let settled = false;
		const done = (value: unknown | undefined) => {
			if (settled) return;
			settled = true;
			resolve(value);
		};

		try {
			const tx = database.transaction(STORE_NAME, 'readonly');
			const req = tx.objectStore(STORE_NAME).get(key);

			req.onsuccess = () => done(req.result);
			req.onerror = () => done(undefined);
			tx.onabort = () => done(undefined);
		} catch {
			done(undefined);
		}
	});
}

// wait for a write to commit; resolves true only on a confirmed write
function writeValue(database: IDBDatabase, key: string, value: unknown): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
		let settled = false;
		const done = (ok: boolean) => {
			if (settled) return;
			settled = true;
			resolve(ok);
		};

		try {
			const tx = database.transaction(STORE_NAME, 'readwrite');
			tx.objectStore(STORE_NAME).put(value, key);

			tx.oncomplete = () => done(true);
			tx.onerror = () => done(false);
			tx.onabort = () => done(false);
		} catch {
			done(false);
		}
	});
}

export async function storageGet<T>(key: string): Promise<T | undefined> {
	const database = await open();
	if (!database) return memStore.get(key) as T | undefined;

	const value = await readValue(database, key);
	if (value !== undefined) memStore.set(key, value);
	return value as T | undefined;
}

export async function storageSet<T>(key: string, value: T): Promise<void> {
	const database = await open();
	if (!database) {
		memStore.set(key, value);
		return;
	}

	const ok = await writeValue(database, key, value);
	// keep the fallback coherent with the latest confirmed state
	if (ok) memStore.set(key, value);
}
