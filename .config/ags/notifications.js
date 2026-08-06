import Gtk from "gi://Gtk?version=3.0";

export function NotificationsPopup() {
    const win = new Gtk.Window({
        name: "notifications-popup",
        type: Gtk.WindowType.TOPLEVEL,
        decorated: false,
        resizable: false,
    });

    const box = new Gtk.Box({
        className: "notifications-popup-container",
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 10,
    });

    win.add(box);
    return win;
}
