self.addEventListener("install", (event) => {
  console.log("✅ [PWA] Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("✅ [PWA] Service Worker activated");
});

self.addEventListener("fetch", (event) => {
  // You can cache assets here later
});
