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

// Keep sidepanel hidden on startup
sidePanelWindow.hide();
notificationsWindow.hide();

// Fast IPC Toggle Listener via Runtime File Monitor
const runtimeDir = GLib.get_user_runtime_dir() || "/tmp";
const toggleFilePath = runtimeDir + "/ags_sidepanel_toggle";
const toggleFile = Gio.File.new_for_path(toggleFilePath);

try {
    // Touch file if not exists
    if (!toggleFile.query_exists(null)) {
        toggleFile.create(Gio.FileCreateFlags.NONE, null);
    }

    const monitor = toggleFile.monitor_file(Gio.FileMonitorFlags.NONE, null);
    monitor.connect("changed", () => {
        if (sidePanelWindow.is_visible()) {
            sidePanelWindow.hide();
        } else {
            sidePanelWindow.show_all();
        }
    });
} catch (e) {
    console.error("Failed to setup toggle listener:", e);
}

Gtk.main();
