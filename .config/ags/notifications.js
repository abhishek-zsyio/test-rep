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

    const screen = win.get_screen();
    const visual = screen ? screen.get_rgba_visual() : null;
    if (visual) {
        win.set_visual(visual);
    }
    win.set_app_paintable(true);

    const box = el(Gtk.Box, {
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 10,
    }, "notifications-popup-container");

    win.add(box);
    return win;
}
