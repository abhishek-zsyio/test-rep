import Gtk from "gi://Gtk?version=3.0";
import Gdk from "gi://Gdk?version=3.0";
import GLib from "gi://GLib";
import Gio from "gi://Gio";

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

// --- Header Widget ---
function Header(win) {
    const userLabel = new Gtk.Label({
        className: "header-user",
        xalign: 0,
        label: (exec("whoami") || "USER").toUpperCase(),
    });

    const clockLabel = new Gtk.Label({
        className: "header-clock",
        xalign: 0,
        label: exec('date "+%A, %B %d • %H:%M"'),
    });

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
        clockLabel.set_text(exec('date "+%A, %B %d • %H:%M"'));
        return GLib.SOURCE_CONTINUE;
    });

    const infoBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        hexpand: true,
    });
    infoBox.pack_start(userLabel, false, false, 0);
    infoBox.pack_start(clockLabel, false, false, 0);

    const lockBtn = new Gtk.Button({
        className: "icon-btn lock-btn",
        label: "🔒",
        tooltip_text: "Lock Screen",
    });
    lockBtn.connect("clicked", () => {
        win.hide();
        execAsync("hyprlock");
    });

    const powerBtn = new Gtk.Button({
        className: "icon-btn power-btn",
        label: "⏻",
        tooltip_text: "Power Menu",
    });
    powerBtn.connect("clicked", () => {
        win.hide();
        execAsync("pkill -x rofi || ~/.config/rofi/powermenu/powermenu.sh");
    });

    const actionsBox = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 8,
    });
    actionsBox.pack_start(lockBtn, false, false, 0);
    actionsBox.pack_start(powerBtn, false, false, 0);

    const box = new Gtk.Box({
        className: "sidepanel-header",
        orientation: Gtk.Orientation.HORIZONTAL,
    });
    box.pack_start(infoBox, true, true, 0);
    box.pack_start(actionsBox, false, false, 0);

    return box;
}

// --- Quick Toggles ---
function QuickToggles() {
    const wifiBtn = new Gtk.Button({
        className: "toggle-btn",
        label: "󰤨  Wi-Fi",
    });
    wifiBtn.connect("clicked", () => {
        execAsync("nmcli radio wifi toggle");
    });

    const btBtn = new Gtk.Button({
        className: "toggle-btn",
        label: "󰂯  Bluetooth",
    });
    btBtn.connect("clicked", () => {
        execAsync("rfkill toggle bluetooth");
    });

    const row1 = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        homogeneous: true,
        spacing: 8,
    });
    row1.pack_start(wifiBtn, true, true, 0);
    row1.pack_start(btBtn, true, true, 0);

    const micBtn = new Gtk.Button({
        className: "toggle-btn",
        label: "󰍬  Mic",
    });
    micBtn.connect("clicked", () => {
        execAsync("pactl set-source-mute @DEFAULT_SOURCE@ toggle");
    });

    const dndBtn = new Gtk.Button({
        className: "toggle-btn",
        label: "󰂛  DND",
    });

    const row2 = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        homogeneous: true,
        spacing: 8,
    });
    row2.pack_start(micBtn, true, true, 0);
    row2.pack_start(dndBtn, true, true, 0);

    const box = new Gtk.Box({
        className: "quick-toggles-container",
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 8,
    });
    box.pack_start(row1, false, false, 0);
    box.pack_start(row2, false, false, 0);

    return box;
}

// --- Sliders ---
function VolumeSlider() {
    const iconBtn = new Gtk.Button({
        className: "slider-icon-btn",
        label: "󰕾",
    });
    iconBtn.connect("clicked", () => {
        execAsync("pactl set-sink-mute @DEFAULT_SINK@ toggle");
    });

    const scale = new Gtk.Scale({
        className: "slider",
        orientation: Gtk.Orientation.HORIZONTAL,
        draw_value: false,
        hexpand: true,
    });
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

    const box = new Gtk.Box({
        className: "slider-box",
        orientation: Gtk.Orientation.HORIZONTAL,
    });
    box.pack_start(iconBtn, false, false, 0);
    box.pack_start(scale, true, true, 0);

    return box;
}

function BrightnessSlider() {
    const iconLabel = new Gtk.Label({
        className: "slider-icon",
        label: "󰃟 ",
    });

    const scale = new Gtk.Scale({
        className: "slider",
        orientation: Gtk.Orientation.HORIZONTAL,
        draw_value: false,
        hexpand: true,
    });
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

    const box = new Gtk.Box({
        className: "slider-box",
        orientation: Gtk.Orientation.HORIZONTAL,
    });
    box.pack_start(iconLabel, false, false, 0);
    box.pack_start(scale, true, true, 0);

    return box;
}

// --- Notifications Center ---
function NotificationsCenter() {
    const titleLabel = new Gtk.Label({
        className: "notifications-title",
        label: "Notifications",
        xalign: 0,
        hexpand: true,
    });

    const clearBtn = new Gtk.Button({
        className: "clear-btn",
        label: "Clear All 󰆴",
    });

    const listContainer = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 8,
    });

    const emptyLabel = new Gtk.Label({
        className: "empty-notifications",
        label: "No Notifications",
    });
    listContainer.pack_start(emptyLabel, true, true, 0);

    const scroll = new Gtk.ScrolledWindow({
        className: "notifications-scroll",
        hscrollbar_policy: Gtk.PolicyType.NEVER,
        vscrollbar_policy: Gtk.PolicyType.AUTOMATIC,
        vexpand: true,
    });
    scroll.add(listContainer);

    const headerBox = new Gtk.Box({
        className: "notifications-header",
        orientation: Gtk.Orientation.HORIZONTAL,
    });
    headerBox.pack_start(titleLabel, true, true, 0);
    headerBox.pack_start(clearBtn, false, false, 0);

    const box = new Gtk.Box({
        className: "notifications-center",
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 8,
    });
    box.pack_start(headerBox, false, false, 0);
    box.pack_start(scroll, true, true, 0);

    return box;
}

// --- SidePanel Window ---
export function SidePanel() {
    const win = new Gtk.Window({
        name: "sidepanel",
        type: Gtk.WindowType.TOPLEVEL,
        decorated: false,
        resizable: false,
        default_width: 360,
        default_height: 700,
    });

    const content = new Gtk.Box({
        className: "sidepanel-container",
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 14,
    });

    content.pack_start(Header(win), false, false, 0);
    content.pack_start(QuickToggles(), false, false, 0);
    content.pack_start(VolumeSlider(), false, false, 0);
    content.pack_start(BrightnessSlider(), false, false, 0);
    content.pack_start(NotificationsCenter(), true, true, 0);

    win.add(content);
    return win;
}
