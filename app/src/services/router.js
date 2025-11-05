// Derivative work from original by (c) Joshua Tzucker - MIT License
// https://joshuatz.com/posts/2021/deploy-preact-from-subdirectory/

import { route } from 'preact-router';

const APP_BASE_URL_NO_SLASH_END = import.meta.env.VITE_APP_BASE;

/**
 * Wrapper around preact-router `route()`, since they have not implemented a
 * base URL option, needed for subdirectories, or custom base paths
 *
 * @param {string | { url: string; replace?: boolean }} input
 * @param {boolean} [replace]
 */
export function customRoute(input, replace) {
    const inputUrl = typeof input === 'string' ? input : input.url;
    let patchedUrl = inputUrl;
    if (!patchedUrl.startsWith(APP_BASE_URL_NO_SLASH_END)) {
        const sep = !patchedUrl.startsWith('/') ? '/' : '';
        patchedUrl = `${APP_BASE_URL_NO_SLASH_END}${sep}${patchedUrl}`;
    }

    if (typeof input === 'string') {
        return route(patchedUrl, replace);
    }

    return route({
        url: patchedUrl,
        replace: input.replace,
    });
};