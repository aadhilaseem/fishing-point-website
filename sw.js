// ==========================================================================
// Fishing Point - Service Worker Self-Unregister & Cache Purge
// Ensures instant delivery of fresh updates during active testing
// ==========================================================================

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((k) => caches.delete(k)));
        }).then(() => {
            return self.registration.unregister();
        }).then(() => {
            return self.clients.claim();
        })
    );
});
