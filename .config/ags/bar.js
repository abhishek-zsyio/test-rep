import Gtk from "gi://Gtk?version=3.0";
import Gdk from "gi://Gdk?version=3.0";
import GLib from "gi://GLib";
import Gio from "gi://Gio";
import Pango from "gi://Pango";

function el(WidgetClass, props = {}, cssClass = "") {
    const w = new WidgetClass(props);
    if (cssClass) {
        cssClass.split(" ").forEach(c => {
            if (c) w.get_style_context().add_class(c);
        });
    }
    return w;
}

function exec(cmd) {
    try {
        const [ok, out] = GLib.spawn_command_line_sync(cmd);
        return ok ? new TextDecoder().decode(out).trim() : "";
    } catch (e) {
        return "";
    }
}

function execAsync(cmd) {
    try {
        GLib.spawn_command_line_async(cmd);
    } catch (e) {}
}

// --- Workspaces Widget ---
function Workspaces() {
    const box = el(Gtk.Box, {
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 4,
    }, "bar-workspaces");

    const buttons = [];

    for (let i = 1; i <= 5; i++) {
        const btn = el(Gtk.Button, {
            label: `${i}`,
        }, i === 1 ? "ws-btn active" : "ws-btn");

        btn.connect("clicked", () => {
            execAsync(`hyprctl dispatch workspace ${i}`);
            buttons.forEach((b, idx) => {
                b.get_style_context().remove_class("active");
                if (idx + 1 === i) {
                    b.get_style_context().add_class("active");
                }
            });
        });
        buttons.push(btn);
        box.pack_start(btn, false, false, 0);
    }

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
        const activeWs = exec("sh -c \"hyprctl activeworkspace -j | grep -oP '(?<=\"id\": )\\d+' || echo 1\"");
        if (activeWs) {
            const wsNum = parseInt(activeWs, 10);
            buttons.forEach((b, idx) => {
                b.get_style_context().remove_class("active");
                if (idx + 1 === wsNum) {
                    b.get_style_context().add_class("active");
                }
            });
        }
        return GLib.SOURCE_CONTINUE;
    });

    return box;
}

// --- Active Window Title Widget ---
function WindowTitle() {
    const label = el(Gtk.Label, {
        label: "Desktop",
        xalign: 0.5,
        ellipsize: Pango.EllipsizeMode.END,
        max_width_chars: 40,
    }, "bar-window-title");

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
        const title = exec("sh -c \"hyprctl activewindow -j | grep -oP '(?<=\"title\": \").*?(?=\")' | head -n1\"");
        label.set_text(title || "Hyprland");
        return GLib.SOURCE_CONTINUE;
    });

    return label;
}

// --- System Status Pills ---
function SystemStats() {
    const volLabel = el(Gtk.Label, { label: "󰕾 50%" }, "bar-stat-pill");
    const wifiLabel = el(Gtk.Label, { label: "󰤨 WiFi" }, "bar-stat-pill");

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2000, () => {
        const vol = exec("sh -c \"pactl get-sink-volume @DEFAULT_SINK@ | grep -oP '\\d+(?=%)' | head -n1\"");
        if (vol) {
            volLabel.set_text(`󰕾 ${vol}%`);
        }
        return GLib.SOURCE_CONTINUE;
    });

    const sidePanelBtn = el(Gtk.Button, {
        label: "󰍜 Control",
        tooltip_text: "Toggle Control Center (SUPER + N)",
    }, "bar-stat-btn");

    sidePanelBtn.connect("clicked", () => {
        const runtimeDir = GLib.get_user_runtime_dir() || "/tmp";
        execAsync(`touch ${runtimeDir}/ags_sidepanel_toggle`);
    });

    const box = el(Gtk.Box, {
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 8,
    }, "bar-stats");

    box.pack_start(volLabel, false, false, 0);
    box.pack_start(wifiLabel, false, false, 0);
    box.pack_start(sidePanelBtn, false, false, 0);

    return box;
}

// --- Time & Date Widget ---
function Clock() {
    const label = el(Gtk.Label, {
        label: exec('date "+%H:%M"'),
    }, "bar-clock-pill");

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
        label.set_text(exec('date "+%H:%M"'));
        return GLib.SOURCE_CONTINUE;
    });

    return label;
}

// --- Bar Window ---
export function Bar() {
    const win = el(Gtk.Window, {
        name: "topbar",
        type: Gtk.WindowType.TOPLEVEL,
        decorated: false,
        resizable: false,
    }, "bar-window");

    const screen = win.get_screen();
    const visual = screen ? screen.get_rgba_visual() : null;
    if (visual) {
        win.set_visual(visual);
    }
    win.set_app_paintable(true);

    const left = Workspaces();
    const center = WindowTitle();

    const rightBox = el(Gtk.Box, {
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 8,
    });
    rightBox.pack_start(SystemStats(), false, false, 0);
    rightBox.pack_start(Clock(), false, false, 0);

    const barContainer = el(Gtk.Box, {
        orientation: Gtk.Orientation.HORIZONTAL,
    }, "bar-container");

    barContainer.pack_start(left, false, false, 0);
    barContainer.set_center_widget(center);
    barContainer.pack_end(rightBox, false, false, 0);

    win.add(barContainer);
    return win;
}
