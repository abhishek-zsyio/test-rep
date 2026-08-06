import { App, Gtk } from "astal/gtk3";
import Notif from "gi://AstalNotif";

const notif = Notif.get_default();

export function NotificationsPopup() {
    const box = new Gtk.Box({
        className: "notifications-popup-container",
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 10,
    });

    if (notif) {
        notif.connect("notified", (_, id) => {
            const n = notif.get_notification(id);
            if (n && !notif.dont_disturb) {
                const toast = new Gtk.Box({
                    className: "notification-toast",
                    orientation: Gtk.Orientation.VERTICAL,
                });
                const appLbl = new Gtk.Label({
                    className: "toast-app",
                    label: n.appName || "System",
                    xalign: 0,
                });
                const summaryLbl = new Gtk.Label({
                    className: "toast-summary",
                    label: n.summary || "",
                    xalign: 0,
                });

                toast.pack_start(appLbl, false, false, 0);
                toast.pack_start(summaryLbl, false, false, 0);
                box.pack_start(toast, false, false, 0);
                box.show_all();

                setTimeout(() => {
                    box.remove(toast);
                }, 5000);
            }
        });
    }

    const win = new Gtk.Window({
        name: "notifications-popup",
        type: Gtk.WindowType.TOPLEVEL,
        decorated: false,
        resizable: false,
    });
    win.add(box);

    App.add_window(win);
    return win;
}
