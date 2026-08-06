import Gtk from "gi://Gtk?version=3.0";
import Gdk from "gi://Gdk?version=3.0";
import Gio from "gi://Gio";
import GLib from "gi://GLib";

import { SidePanel } from "./sidepanel.js";
import { NotificationsPopup } from "./notifications.js";

Gtk.init(null);

const cssProvider = new Gtk.CssProvider();
const cssPath = GLib.get_user_config_dir() + "/ags/style.css";

try {
    cssProvider.load_from_path(cssPath);
    Gtk.StyleContext.add_provider_for_screen(
        Gdk.Screen.get_default(),
        cssProvider,
        Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
    );
} catch (e) {
    console.error("Failed to load CSS:", e);
}

const sidePanelWindow = SidePanel();
const notificationsWindow = NotificationsPopup();

sidePanelWindow.show_all();
notificationsWindow.show_all();

Gtk.main();
