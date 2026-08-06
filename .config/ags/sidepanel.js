import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import Network from 'resource:///com/github/Aylur/ags/service/network.js';
import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';
import Utils from 'resource:///com/github/Aylur/ags/utils.js';
import App from 'resource:///com/github/Aylur/ags/app.js';

// --- Header Widget ---
const Header = () => Widget.Box({
    className: 'sidepanel-header',
    children: [
        Widget.Box({
            vertical: true,
            hexpand: true,
            children: [
                Widget.Label({
                    className: 'header-user',
                    xalign: 0,
                    label: Utils.exec('whoami').toUpperCase(),
                }),
                Widget.Label({
                    className: 'header-clock',
                    xalign: 0,
                    setup: self => self
                        .poll(1000, self => {
                            self.label = Utils.exec('date "+%A, %B %d • %H:%M"');
                        }),
                }),
            ],
        }),
        Widget.Box({
            className: 'header-actions',
            spacing: 8,
            children: [
                Widget.Button({
                    className: 'icon-btn lock-btn',
                    onClicked: () => {
                        App.closeWindow('sidepanel');
                        Utils.execAsync('hyprlock');
                    },
                    child: Widget.Label({ label: '🔒' }),
                    tooltipText: 'Lock Screen',
                }),
                Widget.Button({
                    className: 'icon-btn power-btn',
                    onClicked: () => {
                        App.closeWindow('sidepanel');
                        Utils.execAsync('pkill -x rofi || ~/.config/rofi/powermenu/powermenu.sh');
                    },
                    child: Widget.Label({ label: '⏻' }),
                    tooltipText: 'Power Menu',
                }),
            ],
        }),
    ],
});

// --- Quick Toggles ---
const QuickToggles = () => Widget.Grid({
    className: 'quick-toggles-grid',
    columnSpacing: 10,
    rowSpacing: 10,
    homogeneous: true,
    children: [
        // WiFi Toggle
        Widget.Button({
            className: 'toggle-btn',
            onClicked: () => {
                const state = Network.wifi.enabled;
                Network.wifi.enabled = !state;
            },
            setup: self => self.hook(Network, () => {
                const active = Network.wifi?.enabled;
                self.toggleClassName('active', Boolean(active));
            }),
            child: Widget.Box({
                spacing: 8,
                children: [
                    Widget.Label({ label: '󰤨' }),
                    Widget.Label({
                        label: 'Wi-Fi',
                        setup: self => self.hook(Network, () => {
                            self.label = Network.wifi?.ssid || (Network.wifi?.enabled ? 'Disconnected' : 'Off');
                        }),
                    }),
                ],
            }),
        }),
        // Bluetooth Toggle
        Widget.Button({
            className: 'toggle-btn',
            onClicked: () => {
                const state = Bluetooth.enabled;
                Bluetooth.enabled = !state;
            },
            setup: self => self.hook(Bluetooth, () => {
                self.toggleClassName('active', Bluetooth.enabled);
            }),
            child: Widget.Box({
                spacing: 8,
                children: [
                    Widget.Label({ label: '󰂯' }),
                    Widget.Label({
                        label: 'Bluetooth',
                        setup: self => self.hook(Bluetooth, () => {
                            self.label = Bluetooth.enabled ? (Bluetooth.connected_devices.length ? `${Bluetooth.connected_devices.length} Connected` : 'On') : 'Off';
                        }),
                    }),
                ],
            }),
        }),
        // Mic Mute Toggle
        Widget.Button({
            className: 'toggle-btn',
            onClicked: () => {
                if (Audio.microphone) {
                    Audio.microphone.is_muted = !Audio.microphone.is_muted;
                }
            },
            setup: self => self.hook(Audio, () => {
                const muted = Audio.microphone?.is_muted;
                self.toggleClassName('active', !muted);
            }),
            child: Widget.Box({
                spacing: 8,
                children: [
                    Widget.Label({ label: '󰍬' }),
                    Widget.Label({
                        label: 'Mic',
                        setup: self => self.hook(Audio, () => {
                            self.label = Audio.microphone?.is_muted ? 'Muted' : 'Active';
                        }),
                    }),
                ],
            }),
        }),
        // Do Not Disturb Toggle
        Widget.Button({
            className: 'toggle-btn',
            onClicked: () => {
                Notifications.dnd = !Notifications.dnd;
            },
            setup: self => self.hook(Notifications, () => {
                self.toggleClassName('active', Notifications.dnd);
            }),
            child: Widget.Box({
                spacing: 8,
                children: [
                    Widget.Label({ label: '󰂛' }),
                    Widget.Label({
                        label: 'DND',
                        setup: self => self.hook(Notifications, () => {
                            self.label = Notifications.dnd ? 'On' : 'Off';
                        }),
                    }),
                ],
            }),
        }),
    ],
});

// --- Sliders (Volume & Brightness) ---
const VolumeSlider = () => Widget.Box({
    className: 'slider-box',
    children: [
        Widget.Button({
            className: 'slider-icon-btn',
            onClicked: () => {
                if (Audio.speaker) {
                    Audio.speaker.is_muted = !Audio.speaker.is_muted;
                }
            },
            child: Widget.Label({
                label: '󰕾',
                setup: self => self.hook(Audio, () => {
                    if (Audio.speaker?.is_muted) {
                        self.label = '󰖁';
                    } else {
                        self.label = '󰕾';
                    }
                }),
            }),
        }),
        Widget.Slider({
            className: 'slider',
            hexpand: true,
            drawValue: false,
            onChange: ({ value }) => {
                if (Audio.speaker) {
                    Audio.speaker.volume = value;
                }
            },
            setup: self => self.hook(Audio, () => {
                if (Audio.speaker) {
                    self.value = Audio.speaker.volume || 0;
                }
            }),
        }),
    ],
});

const BrightnessSlider = () => Widget.Box({
    className: 'slider-box',
    children: [
        Widget.Label({
            className: 'slider-icon',
            label: '󰃟',
        }),
        Widget.Slider({
            className: 'slider',
            hexpand: true,
            drawValue: false,
            onChange: ({ value }) => {
                const percent = Math.round(value * 100);
                Utils.execAsync(`brightnessctl s ${percent}%`).catch(() => {});
            },
            setup: self => self.poll(2000, self => {
                Utils.execAsync('brightnessctl g')
                    .then(current => {
                        Utils.execAsync('brightnessctl m')
                            .then(max => {
                                self.value = Number(current) / Number(max);
                            }).catch(() => {});
                    }).catch(() => {});
            }),
        }),
    ],
});

// --- Media Player ---
const MediaPlayer = () => Widget.Box({
    className: 'media-player',
    vertical: true,
    setup: self => self.hook(Mpris, () => {
        const players = Mpris.players;
        self.visible = players.length > 0;
    }),
    children: [
        Widget.Box({
            className: 'media-info',
            spacing: 12,
            children: [
                Widget.Icon({
                    className: 'media-art',
                    size: 48,
                    setup: self => self.hook(Mpris, () => {
                        const player = Mpris.players[0];
                        if (player && player.cover_path) {
                            self.icon = player.cover_path;
                        } else {
                            self.icon = 'audio-x-generic';
                        }
                    }),
                }),
                Widget.Box({
                    vertical: true,
                    hexpand: true,
                    children: [
                        Widget.Label({
                            className: 'media-title',
                            xalign: 0,
                            truncate: 'end',
                            setup: self => self.hook(Mpris, () => {
                                const player = Mpris.players[0];
                                self.label = player ? (player.track_title || 'Unknown Title') : 'No Media';
                            }),
                        }),
                        Widget.Label({
                            className: 'media-artist',
                            xalign: 0,
                            truncate: 'end',
                            setup: self => self.hook(Mpris, () => {
                                const player = Mpris.players[0];
                                self.label = player ? (player.track_artists.join(', ') || 'Unknown Artist') : '';
                            }),
                        }),
                    ],
                }),
            ],
        }),
        Widget.Box({
            className: 'media-controls',
            homogeneous: true,
            children: [
                Widget.Button({
                    onClicked: () => Mpris.players[0]?.previous(),
                    child: Widget.Label({ label: '󰒮' }),
                }),
                Widget.Button({
                    onClicked: () => Mpris.players[0]?.playPause(),
                    child: Widget.Label({
                        label: '󰐊',
                        setup: self => self.hook(Mpris, () => {
                            const player = Mpris.players[0];
                            self.label = player?.play_back_status === 'Playing' ? '󰏤' : '󰐊';
                        }),
                    }),
                }),
                Widget.Button({
                    onClicked: () => Mpris.players[0]?.next(),
                    child: Widget.Label({ label: '󰒝' }),
                }),
            ],
        }),
    ],
});

// --- Notifications List ---
const NotificationItem = (n) => Widget.Box({
    className: `notification-item ${n.urgency}`,
    vertical: true,
    children: [
        Widget.Box({
            className: 'notification-item-header',
            children: [
                Widget.Label({
                    className: 'notification-app',
                    xalign: 0,
                    hexpand: true,
                    label: n.app_name || 'System',
                }),
                Widget.Button({
                    className: 'notification-close',
                    onClicked: () => n.close(),
                    child: Widget.Label({ label: '✕' }),
                }),
            ],
        }),
        Widget.Label({
            className: 'notification-summary',
            xalign: 0,
            truncate: 'end',
            label: n.summary,
        }),
        n.body ? Widget.Label({
            className: 'notification-body',
            xalign: 0,
            wrap: true,
            label: n.body,
        }) : null,
    ].filter(Boolean),
});

const NotificationsCenter = () => Widget.Box({
    className: 'notifications-center',
    vertical: true,
    children: [
        Widget.Box({
            className: 'notifications-header',
            children: [
                Widget.Label({
                    className: 'notifications-title',
                    label: 'Notifications',
                    hexpand: true,
                    xalign: 0,
                }),
                Widget.Button({
                    className: 'clear-btn',
                    onClicked: () => Notifications.clear(),
                    setup: self => self.hook(Notifications, () => {
                        self.visible = Notifications.notifications.length > 0;
                    }),
                    child: Widget.Label({ label: 'Clear All 󰆴' }),
                }),
            ],
        }),
        Widget.Scrollable({
            hscroll: 'never',
            vscroll: 'automatic',
            className: 'notifications-scroll',
            vexpand: true,
            child: Widget.Box({
                vertical: true,
                className: 'notifications-list',
                spacing: 8,
                setup: self => self.hook(Notifications, () => {
                    self.children = Notifications.notifications.length > 0
                        ? Notifications.notifications.map(NotificationItem)
                        : [Widget.Label({
                            className: 'empty-notifications',
                            label: 'No Notifications',
                        })];
                }),
            }),
        }),
    ],
});

// --- SidePanel Window Export ---
export const SidePanel = () => Widget.Window({
    name: 'sidepanel',
    anchor: ['top', 'right', 'bottom'],
    layer: 'top',
    visible: false,
    keymode: 'on-demand',
    child: Widget.Box({
        className: 'sidepanel-container',
        vertical: true,
        spacing: 14,
        children: [
            Header(),
            QuickToggles(),
            VolumeSlider(),
            BrightnessSlider(),
            MediaPlayer(),
            NotificationsCenter(),
        ],
    }),
});
