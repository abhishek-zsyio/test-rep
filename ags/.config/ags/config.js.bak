import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
import Utils from 'resource:///com/github/Aylur/ags/utils.js';

// Workspaces Widget
const Workspaces = () => Widget.Box({
    className: 'workspaces module',
    children: Array.from({ length: 10 }, (_, i) => i + 1).map(id => Widget.Button({
        onClicked: () => Hyprland.messageAsync(`dispatch workspace ${id}`),
        child: Widget.Label(`${id}`),
        setup: self => self.hook(Hyprland, () => {
            self.toggleClassName('active', Hyprland.active.workspace.id === id);
        }),
    })),
});

// Clock Widget
const Clock = () => Widget.Label({
    className: 'clock module',
    setup: self => self.poll(1000, self => {
        self.label = Utils.exec('date "+%b %d  %H:%M"');
    }),
});

// Volume Widget
const Volume = () => Widget.Box({
    className: 'volume module',
    children: [
        Widget.Icon({
            icon: 'audio-volume-high-symbolic',
        }),
        Widget.Label({
            setup: self => self.hook(Audio, () => {
                const vol = Math.round((Audio.speaker?.volume || 0) * 100);
                self.label = `${vol}%`;
            }, 'speaker-changed'),
        }),
    ],
});

// Battery Widget
const BatteryWidget = () => Widget.Box({
    className: 'battery module',
    children: [
        Widget.Icon({
            icon: 'battery-good-symbolic',
        }),
        Widget.Label({
            setup: self => self.hook(Battery, () => {
                self.label = `${Battery.percent}%`;
            }),
        }),
    ],
});

// System Tray Widget
const SysTray = () => Widget.Box({
    className: 'tray module',
    setup: self => self.hook(SystemTray, () => {
        self.children = SystemTray.items.map(item => Widget.Button({
            child: Widget.Icon({ icon: item.icon_name || 'image-missing' }),
            onPrimaryClick: (_, event) => item.activate(event),
            onSecondaryClick: (_, event) => item.openMenu(event),
            tooltipMarkup: item.tooltip_markup || '',
        }));
    }),
});

// Top Floating Bar
const Bar = (monitor = 0) => Widget.Window({
    name: `bar-${monitor}`,
    monitor,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    child: Widget.CenterBox({
        className: 'bar-container',
        startWidget: Widget.Box({
            children: [Workspaces()],
        }),
        centerWidget: Clock(),
        endWidget: Widget.Box({
            hpack: 'end',
            spacing: 8,
            children: [SysTray(), Volume(), BatteryWidget()],
        }),
    }),
});

export default {
    style: App.configDir + '/style/main.scss',
    windows: [Bar(0)],
};
