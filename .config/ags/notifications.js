import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';

const PopupItem = (n) => Widget.EventBox({
    onPrimaryClick: () => n.dismiss(),
    child: Widget.Box({
        className: `notification-toast ${n.urgency}`,
        vertical: true,
        children: [
            Widget.Box({
                className: 'toast-header',
                children: [
                    Widget.Label({
                        className: 'toast-app',
                        xalign: 0,
                        hexpand: true,
                        label: n.app_name || 'System',
                    }),
                    Widget.Button({
                        className: 'toast-close',
                        onClicked: () => n.close(),
                        child: Widget.Label({ label: '✕' }),
                    }),
                ],
            }),
            Widget.Label({
                className: 'toast-summary',
                xalign: 0,
                truncate: 'end',
                label: n.summary,
            }),
            n.body ? Widget.Label({
                className: 'toast-body',
                xalign: 0,
                wrap: true,
                label: n.body,
            }) : null,
        ].filter(Boolean),
    }),
});

export const NotificationsPopup = () => Widget.Window({
    name: 'notifications-popup',
    anchor: ['top', 'right'],
    layer: 'overlay',
    child: Widget.Box({
        className: 'notifications-popup-container',
        vertical: true,
        spacing: 10,
        setup: self => self.hook(Notifications, (_, id) => {
            if (id && Notifications.getNotification(id)) {
                const n = Notifications.getNotification(id);
                if (n && !Notifications.dnd) {
                    const popup = PopupItem(n);
                    self.pack_start(popup, false, false, 0);
                    self.show_all();
                    setTimeout(() => {
                        popup.destroy();
                    }, 5000);
                }
            }
        }, 'notified'),
    }),
});
