import Gtk from "gi://Gtk?version=3.0";

function el(WidgetClass, props = {}, cssClass = "") {
    const w = new WidgetClass(props);
    if (cssClass) {
        cssClass.split(" ").forEach(c => {
            if (c) w.get_style_context().add_class(c);
        });
    }
    return w;
}

export function NotificationsPopup() {
    const win = el(Gtk.Window, {
        name: "notifications-popup",
        type: Gtk.WindowType.TOPLEVEL,
        decorated: false,
        resizable: false,
    });

    const box = el(Gtk.Box, {
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 10,
    }, "notifications-popup-container");

    win.add(box);
    return win;
}
