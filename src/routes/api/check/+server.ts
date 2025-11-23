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

        // only consider HTTP 200 as "up", anything else is "down"
        if (response.status === 200) {
            return new Response('OK', { status: 200 });
        } else {
            console.error(`Site ${site.name} returned status ${response.status}`);
            return new Response(`Site returned ${response.status}`, { status: 500 });
        }
    } catch (error: any) {
        console.error('Check error:', error);
        return new Response(`Check failed: ${error.message}`, { status: 500 });
    }
};