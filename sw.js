// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('Service Worker registered successfully');
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              showToast('App updated for offline use', 'success');
            }
          });
        });
      })
      .catch(err => {
        console.log('SW registration failed:', err);
        // Fallback: direct cache
        if ('caches' in window) {
          caches.open('udhaar-offline-v2').then(cache => {
            const html = '<!DOCTYPE html>' + document.documentElement.outerHTML;
            cache.put(new Request(location.href), 
              new Response(html, { headers: { 'Content-Type': 'text/html;charset=utf-8' }}));
          });
        }
      });
  });
}
