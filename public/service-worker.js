self.addEventListener("install", (event) => {
  console.log("✅ [PWA] Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("✅ [PWA] Service Worker activated");
  return self.clients.claim();
});

// Handle navigation requests for SPA routes
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // Handle navigation requests (HTML)
  if (event.request.mode === 'navigate') {
    // For all navigation requests within your app's scope, return index.html
    if (url.pathname.startsWith('/input/')) {
      event.respondWith(
        fetch('/input/').catch(() => {
          return caches.match('/input/');
        })
      );
    }
  }
});
