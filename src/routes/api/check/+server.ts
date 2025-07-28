import type { RequestHandler } from './$types';
import { sites } from '$lib/config/sites';

export const POST: RequestHandler = async ({ request, fetch }) => {
    const { id: targetId } = await request.json();

    if (!targetId) {
        return new Response('Site ID missing', { status: 400 });
    }

    const site = sites.find(s => s.id === targetId);

    if (!site || !site.url) {
        return new Response('Site not found or URL missing', { status: 404 });
    }

    try {
        const response = await fetch(site.url, {
            method: 'GET',
            headers: {
                'User-Agent': 'K9Crypt Checker',
            },
        });

        const headers = new Headers(response.headers);
        headers.delete('set-cookie');
        headers.delete('x-powered-by');
        headers.delete('content-encoding'); 

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: headers,
        });
    } catch (error: any) {
        console.error('Check error:', error);
        return new Response(`Check failed: ${error.message}`, { status: 500 });
    }
};