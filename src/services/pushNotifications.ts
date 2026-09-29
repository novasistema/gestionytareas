// System notification service for mobile devices and desktop
class PushNotificationService {
  private hasNotificationSupport = typeof window !== 'undefined' && 'Notification' in window;

  public getPermission(): NotificationPermission {
    if (!this.hasNotificationSupport) return 'denied';
    return Notification.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.hasNotificationSupport) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  }

  public showNotification(title: string, body: string, options?: { tag?: string; onClick?: () => void }) {
    if (!this.hasNotificationSupport || Notification.permission !== 'granted') {
      return;
    }

    try {
      // Check for Service Worker showNotification if available (best for mobile PWA)
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: '/pwa-192x192.png',
            badge: '/apple-touch-icon.png',
            tag: options?.tag || 'ferre-task',
            vibrate: [200, 100, 200],
            data: { url: window.location.href }
          } as NotificationOptions);
        }).catch(() => {
          this.fallbackNotification(title, body, options);
        });
      } else {
        this.fallbackNotification(title, body, options);
      }
    } catch (err) {
      console.warn('Notification error:', err);
    }
  }

  private fallbackNotification(title: string, body: string, options?: { tag?: string; onClick?: () => void }) {
    try {
      const notif = new Notification(title, {
        body,
        icon: '/pwa-192x192.png',
        badge: '/apple-touch-icon.png',
        tag: options?.tag || 'ferre-task'
      });

      if (options?.onClick) {
        notif.onclick = () => {
          window.focus();
          options.onClick?.();
          notif.close();
        };
      }
    } catch (err) {
      console.warn('Fallback notification error:', err);
    }
  }

  // Update App Badge count on home screen icon (PWA App Badge API)
  public updateBadge(count: number) {
    if (typeof navigator !== 'undefined' && 'setAppBadge' in navigator) {
      if (count > 0) {
        (navigator as unknown as { setAppBadge: (c: number) => Promise<void> }).setAppBadge(count).catch(() => {});
      } else {
        (navigator as unknown as { clearAppBadge: () => Promise<void> }).clearAppBadge().catch(() => {});
      }
    }
  }
}

export const pushNotifications = new PushNotificationService();
