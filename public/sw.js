self.addEventListener("push", function (event) {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/favicon-192.png",
      badge: "/favicon-32x32.png",
      data: { url: data.url || "/lawyer/dashboard" },
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function (clientList) {
      const url = event.notification.data?.url || "/lawyer/dashboard";
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client)
          return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
