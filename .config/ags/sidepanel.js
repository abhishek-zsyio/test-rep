import Gtk from "gi://Gtk?version=3.0";
import Gdk from "gi://Gdk?version=3.0";
import GLib from "gi://GLib";
import Gio from "gi://Gio";

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

// --- Header Card ---
function Header(win) {
    const userLabel = el(Gtk.Label, {
        xalign: 0,
        label: `Hello, ${(exec("whoami") || "USER").toUpperCase()}`,
    }, "header-user");

    const uptimeLabel = el(Gtk.Label, {
        xalign: 0,
        label: `Up ${exec("uptime -p").replace("up ", "")}`,
    }, "header-uptime");

    const clockLabel = el(Gtk.Label, {
        xalign: 0,
        label: exec('date "+%A, %B %d • %H:%M"'),
    }, "header-clock");

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
        clockLabel.set_text(exec('date "+%A, %B %d • %H:%M"'));
        uptimeLabel.set_text(`Up ${exec("uptime -p").replace("up ", "")}`);
        return GLib.SOURCE_CONTINUE;
    });

    const infoBox = el(Gtk.Box, {
        orientation: Gtk.Orientation.VERTICAL,
        hexpand: true,
    });
    infoBox.pack_start(userLabel, false, false, 0);
    infoBox.pack_start(uptimeLabel, false, false, 0);
    infoBox.pack_start(clockLabel, false, false, 0);

    const shotBtn = el(Gtk.Button, {
        label: "📸",
        tooltip_text: "Take Screenshot",
    }, "icon-btn");
    shotBtn.connect("clicked", () => {
        win.hide();
        execAsync("sh -c '/home/abhishek/.config/hypr/scripts/screenshot.sh s'");
    });

    const lockBtn = el(Gtk.Button, {
        label: "🔒",
        tooltip_text: "Lock Screen",
    }, "icon-btn lock-btn");
    lockBtn.connect("clicked", () => {
        win.hide();
        execAsync("hyprlock");
    });

    const powerBtn = el(Gtk.Button, {
        label: "⏻",
        tooltip_text: "Power Menu",
    }, "icon-btn power-btn");
    powerBtn.connect("clicked", () => {
        win.hide();
        execAsync("pkill -x rofi || ~/.config/rofi/powermenu/powermenu.sh");
    });

    const actionsBox = el(Gtk.Box, {
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 6,
    });
    actionsBox.pack_start(shotBtn, false, false, 0);
    actionsBox.pack_start(lockBtn, false, false, 0);
    actionsBox.pack_start(powerBtn, false, false, 0);

    const box = el(Gtk.Box, {
        orientation: Gtk.Orientation.HORIZONTAL,
    }, "sidepanel-header");
    box.pack_start(infoBox, true, true, 0);
    box.pack_start(actionsBox, false, false, 0);

    return box;
}

// --- System Telemetry Card (CPU & RAM) ---
function SystemTelemetry() {
    const cpuTitle = el(Gtk.Label, { label: "CPU Usage", xalign: 0 }, "telemetry-title");
    const cpuBar = el(Gtk.ProgressBar, { fraction: 0.15 }, "telemetry-bar");

    const ramTitle = el(Gtk.Label, { label: "Memory (RAM)", xalign: 0 }, "telemetry-title");
    const ramBar = el(Gtk.ProgressBar, { fraction: 0.35 }, "telemetry-bar ram-bar");

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2500, () => {
        try {
            const cpuLine = exec("sh -c \"top -bn1 | grep 'Cpu(s)' | awk '{print $2}'\"");
            if (cpuLine) {
                const cpuPct = parseFloat(cpuLine) / 100;
                cpuBar.set_fraction(Math.min(Math.max(cpuPct, 0), 1));
            }

            const ramStr = exec("sh -c \"free | grep Mem | awk '{print $3/$2}'\"");
            if (ramStr) {
                const ramPct = parseFloat(ramStr);
                ramBar.set_fraction(Math.min(Math.max(ramPct, 0), 1));
            }
        } catch (e) {}
        return GLib.SOURCE_CONTINUE;
    });

    const cpuBox = el(Gtk.Box, { orientation: Gtk.Orientation.VERTICAL });
    cpuBox.pack_start(cpuTitle, false, false, 0);
    cpuBox.pack_start(cpuBar, false, false, 0);

    const ramBox = el(Gtk.Box, { orientation: Gtk.Orientation.VERTICAL });
    ramBox.pack_start(ramTitle, false, false, 0);
    ramBox.pack_start(ramBar, false, false, 0);

    const box = el(Gtk.Box, {
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 8,
    }, "telemetry-card");
    box.pack_start(cpuBox, false, false, 0);
    box.pack_start(ramBox, false, false, 0);

    return box;
}

// --- Quick Toggles ---
function QuickToggles() {
    const wifiBtn = el(Gtk.Button, {
        label: "󰤨  Wi-Fi",
    }, "toggle-btn");
    wifiBtn.connect("clicked", () => {
        execAsync("nmcli radio wifi toggle");
    });

    const btBtn = el(Gtk.Button, {
        label: "󰂯  Bluetooth",
    }, "toggle-btn");
    btBtn.connect("clicked", () => {
        execAsync("rfkill toggle bluetooth");
    });

    const row1 = el(Gtk.Box, {
        orientation: Gtk.Orientation.HORIZONTAL,
        homogeneous: true,
        spacing: 8,
    });
    row1.pack_start(wifiBtn, true, true, 0);
    row1.pack_start(btBtn, true, true, 0);

    const micBtn = el(Gtk.Button, {
        label: "󰍬  Mic",
    }, "toggle-btn");
    micBtn.connect("clicked", () => {
        execAsync("pactl set-source-mute @DEFAULT_SOURCE@ toggle");
    });

    const dndBtn = el(Gtk.Button, {
        label: "󰂛  DND",
    }, "toggle-btn");

    const row2 = el(Gtk.Box, {
        orientation: Gtk.Orientation.HORIZONTAL,
        homogeneous: true,
        spacing: 8,
    });
    row2.pack_start(micBtn, true, true, 0);
    row2.pack_start(dndBtn, true, true, 0);

    const box = el(Gtk.Box, {
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 8,
    }, "quick-toggles-container");
    box.pack_start(row1, false, false, 0);
    box.pack_start(row2, false, false, 0);

    return box;
}

// --- Sliders ---
function VolumeSlider() {
    const iconBtn = el(Gtk.Button, {
        label: "󰕾",
    }, "slider-icon-btn");
    iconBtn.connect("clicked", () => {
        execAsync("pactl set-sink-mute @DEFAULT_SINK@ toggle");
    });

    const scale = el(Gtk.Scale, {
        orientation: Gtk.Orientation.HORIZONTAL,
        draw_value: false,
        hexpand: true,
    }, "slider");
    scale.set_range(0, 100);

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2000, () => {
        const volStr = exec("sh -c \"pactl get-sink-volume @DEFAULT_SINK@ | grep -oP '\\d+(?=%)' | head -n1\"");
        if (volStr) {
            scale.set_value(Number(volStr));
        }
        return GLib.SOURCE_CONTINUE;
    });

    scale.connect("value-changed", (sc) => {
        const val = Math.round(sc.get_value());
        execAsync(`pactl set-sink-volume @DEFAULT_SINK@ ${val}%`);
    });

    const box = el(Gtk.Box, {
        orientation: Gtk.Orientation.HORIZONTAL,
    }, "slider-card");
    box.pack_start(iconBtn, false, false, 0);
    box.pack_start(scale, true, true, 0);

    return box;
}

function BrightnessSlider() {
    const iconLabel = el(Gtk.Label, {
        label: "󰃟 ",
    }, "slider-icon");

    const scale = el(Gtk.Scale, {
        orientation: Gtk.Orientation.HORIZONTAL,
        draw_value: false,
        hexpand: true,
    }, "slider");
    scale.set_range(0, 100);

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2000, () => {
        try {
            const cur = Number(exec("brightnessctl g"));
            const max = Number(exec("brightnessctl m"));
            if (max > 0) {
                scale.set_value(Math.round((cur / max) * 100));
            }
        } catch (e) {}
        return GLib.SOURCE_CONTINUE;
    });

    scale.connect("value-changed", (sc) => {
        const pct = Math.round(sc.get_value());
        execAsync(`brightnessctl s ${pct}%`);
    });

    const box = el(Gtk.Box, {
        orientation: Gtk.Orientation.HORIZONTAL,
    }, "slider-card");
    box.pack_start(iconLabel, false, false, 0);
    box.pack_start(scale, true, true, 0);

    return box;
}

// --- Notifications Center ---
function NotificationsCenter() {
    const titleLabel = el(Gtk.Label, {
        label: "Notifications",
        xalign: 0,
        hexpand: true,
    }, "notifications-title");

    const clearBtn = el(Gtk.Button, {
        label: "Clear All 󰆴",
    }, "clear-btn");

    const listContainer = el(Gtk.Box, {
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 8,
    });

    const emptyLabel = el(Gtk.Label, {
        label: "No Notifications",
    }, "empty-notifications");
    listContainer.pack_start(emptyLabel, true, true, 0);

    const scroll = el(Gtk.ScrolledWindow, {
        hscrollbar_policy: Gtk.PolicyType.NEVER,
        vscrollbar_policy: Gtk.PolicyType.AUTOMATIC,
        vexpand: true,
    }, "notifications-scroll");
    scroll.add(listContainer);

    const headerBox = el(Gtk.Box, {
        orientation: Gtk.Orientation.HORIZONTAL,
    }, "notifications-header");
    headerBox.pack_start(titleLabel, true, true, 0);
    headerBox.pack_start(clearBtn, false, false, 0);

    const box = el(Gtk.Box, {
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 8,
    }, "notifications-center");
    box.pack_start(headerBox, false, false, 0);
    box.pack_start(scroll, true, true, 0);

    return box;
}

// --- SidePanel Window ---
export function SidePanel() {
    const win = el(Gtk.Window, {
        name: "sidepanel",
        type: Gtk.WindowType.TOPLEVEL,
        decorated: false,
        resizable: false,
        default_width: 370,
        default_height: 740,
    });

    const content = el(Gtk.Box, {
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 12,
    }, "sidepanel-container");

    content.pack_start(Header(win), false, false, 0);
    content.pack_start(SystemTelemetry(), false, false, 0);
    content.pack_start(QuickToggles(), false, false, 0);
    content.pack_start(VolumeSlider(), false, false, 0);
    content.pack_start(BrightnessSlider(), false, false, 0);
    content.pack_start(NotificationsCenter(), true, true, 0);

    win.add(content);
    return win;
}
