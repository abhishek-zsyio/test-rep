import { App, Gtk, Gdk } from "astal/gtk3";
import { Variable, exec, execAsync } from "astal";
import Notif from "gi://AstalNotif";
import Mpris from "gi://AstalMpris";
import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Bluetooth from "gi://AstalBluetooth";

const notif = Notif.get_default();
const mpris = Mpris.get_default();
const audio = Wp.get_default()?.audio;
const network = Network.get_default();
const bluetooth = Bluetooth.get_default();

// --- Header ---
function Header() {
    const userLabel = new Gtk.Label({
        className: "header-user",
        xalign: 0,
        label: exec("whoami").toUpperCase(),
    });

    const clockLabel = new Gtk.Label({
        className: "header-clock",
        xalign: 0,
    });

    const timeVar = Variable("").poll(1000, () => exec('date "+%A, %B %d • %H:%M"'));
    timeVar.subscribe(val => clockLabel.set_text(val));

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
        App.toggle_window("sidepanel");
        execAsync("hyprlock").catch(() => {});
    });

    const powerBtn = new Gtk.Button({
        className: "icon-btn power-btn",
        label: "⏻",
        tooltip_text: "Power Menu",
    });
    powerBtn.connect("clicked", () => {
        App.toggle_window("sidepanel");
        execAsync("pkill -x rofi || ~/.config/rofi/powermenu/powermenu.sh").catch(() => {});
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
        if (network && network.wifi) {
            network.wifi.set_enabled(!network.wifi.enabled);
        }
    });

    const btBtn = new Gtk.Button({
        className: "toggle-btn",
        label: "󰂯  Bluetooth",
    });
    btBtn.connect("clicked", () => {
        if (bluetooth) {
            bluetooth.toggle();
        }
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
        if (audio && audio.default_microphone) {
            audio.default_microphone.set_mute(!audio.default_microphone.mute);
        }
    });

    const dndBtn = new Gtk.Button({
        className: "toggle-btn",
        label: "󰂛  DND",
    });
    dndBtn.connect("clicked", () => {
        if (notif) {
            notif.set_dont_disturb(!notif.dont_disturb);
        }
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
        if (audio && audio.default_speaker) {
            audio.default_speaker.set_mute(!audio.default_speaker.mute);
        }
    });

    const scale = new Gtk.Scale({
        className: "slider",
        orientation: Gtk.Orientation.HORIZONTAL,
        draw_value: false,
        hexpand: true,
    });
    scale.set_range(0, 1);

    if (audio && audio.default_speaker) {
        scale.set_value(audio.default_speaker.volume || 0);
        audio.default_speaker.connect("notify::volume", (spk) => {
            scale.set_value(spk.volume);
        });
    }

    scale.connect("value-changed", (sc) => {
        if (audio && audio.default_speaker) {
            audio.default_speaker.set_volume(sc.get_value());
        }
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
    scale.set_range(0, 1);

    const brightVar = Variable(0).poll(2000, () => {
        try {
            const cur = Number(exec("brightnessctl g"));
            const max = Number(exec("brightnessctl m"));
            return max > 0 ? cur / max : 0;
        } catch (e) {
            return 0;
        }
    });
    brightVar.subscribe(val => scale.set_value(val));

    scale.connect("value-changed", (sc) => {
        const pct = Math.round(sc.get_value() * 100);
        execAsync(`brightnessctl s ${pct}%`).catch(() => {});
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

    const scroll = new Gtk.ScrolledWindow({
        className: "notifications-scroll",
        hscrollbar_policy: Gtk.PolicyType.NEVER,
        vscrollbar_policy: Gtk.PolicyType.AUTOMATIC,
        vexpand: true,
    });
    scroll.add(listContainer);

    function updateList() {
        listContainer.foreach(child => listContainer.remove(child));
        const notifs = notif ? notif.get_notifications() : [];

        if (notifs.length === 0) {
            const emptyLabel = new Gtk.Label({
                className: "empty-notifications",
                label: "No Notifications",
            });
            listContainer.pack_start(emptyLabel, true, true, 0);
        } else {
            notifs.forEach(n => {
                const item = new Gtk.Box({
                    className: "notification-item",
                    orientation: Gtk.Orientation.VERTICAL,
                });
                const appLbl = new Gtk.Label({
                    className: "notification-app",
                    label: n.appName || "System",
                    xalign: 0,
                    hexpand: true,
                });
                const summaryLbl = new Gtk.Label({
                    className: "notification-summary",
                    label: n.summary || "",
                    xalign: 0,
                });
                item.pack_start(appLbl, false, false, 0);
                item.pack_start(summaryLbl, false, false, 0);
                listContainer.pack_start(item, false, false, 0);
            });
        }
        listContainer.show_all();
    }

    clearBtn.connect("clicked", () => {
        if (notif) {
            notif.get_notifications().forEach(n => n.dismiss());
            updateList();
        }
    });

    if (notif) {
        notif.connect("notified", () => updateList());
        notif.connect("resolved", () => updateList());
    }

    updateList();

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
    const content = new Gtk.Box({
        className: "sidepanel-container",
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 14,
    });

    content.pack_start(Header(), false, false, 0);
    content.pack_start(QuickToggles(), false, false, 0);
    content.pack_start(VolumeSlider(), false, false, 0);
    content.pack_start(BrightnessSlider(), false, false, 0);
    content.pack_start(NotificationsCenter(), true, true, 0);

    const win = new Gtk.Window({
        name: "sidepanel",
        type: Gtk.WindowType.TOPLEVEL,
        decorated: false,
        resizable: false,
    });
    win.add(content);

    App.add_window(win);
    return win;
}
