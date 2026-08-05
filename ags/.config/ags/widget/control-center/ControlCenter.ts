import { Widget, Astal, App } from "astal/gtk3";
import { WifiToggle } from "./toggles/WifiToggle";
import { BluetoothToggle } from "./toggles/BluetoothToggle";
import { VolumeSlider } from "./toggles/VolumeSlider";
import { bind } from "astal";
import mpris from "../../services/mpris";
import notifd from "../../services/notifications";
import { sh } from "../../utils/exec";

export function ControlCenter() {
    const players = bind(mpris, "players");
    const notifications = bind(notifd, "notifications");

    return (
        <window
            name="control-center"
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
            layer={Astal.Layer.TOP}
            keymode={Astal.Keymode.EXCLUSIVE}
            visible={false}
        >
            <box vertical className="control-center">
                {/* Header */}
                <box className="header">
                    <label className="header-title" label="Quick Setting" expand />
                    <button className="icon-btn" onClicked={() => sh("systemctl poweroff")}>󰐥</button>
                </box>

                {/* Quick Toggles Grid */}
                <box className="toggles-grid">
                    <WifiToggle />
                    <BluetoothToggle />
                </box>

                {/* Volume & Brightness Sliders */}
                <box vertical className="sliders-section">
                    <VolumeSlider />
                </box>

                {/* Media Player Card */}
                <box vertical className="media-card">
                    {players.as((pList) => {
                        if (!pList || pList.length === 0) return Widget.Label({ label: "󰎆 No media playing" });
                        const p = pList[0];
                        const title = bind(p, "title");
                        const artist = bind(p, "artist");
                        return Widget.Box({
                            vertical: true,
                            children: [
                                Widget.Label({ className: "media-title", label: title.as((t) => t || "Unknown Track") }),
                                Widget.Label({ className: "media-artist", label: artist.as((a) => a || "Unknown Artist") }),
                                Widget.Box({
                                    className: "media-controls",
                                    children: [
                                        Widget.Button({ label: "󰒮", onClicked: () => p.previous() }),
                                        Widget.Button({ label: "󰏤", onClicked: () => p.play_pause() }),
                                        Widget.Button({ label: "󰒍", onClicked: () => p.next() }),
                                    ],
                                }),
                            ],
                        });
                    })}
                </box>

                {/* Notification Center Section */}
                <box vertical className="notifications-section">
                    <box className="notif-header">
                        <label className="notif-title" label="󰂚 Notifications" expand />
                        <button
                            className="clear-btn"
                            onClicked={() => notifd.get_notifications().forEach((n) => n.dismiss())}
                        >
                            Clear
                        </button>
                    </box>
                    <scrollable heightRequest={150}>
                        <box vertical className="notif-list">
                            {notifications.as((nList) => {
                                if (!nList || nList.length === 0)
                                    return Widget.Label({ className: "empty-notif", label: "No notifications" });

                                return nList.map((n) =>
                                    Widget.Box({
                                        className: "notif-item",
                                        vertical: true,
                                        children: [
                                            Widget.Label({ className: "summary", label: n.summary }),
                                            Widget.Label({ className: "body", label: n.body }),
                                        ],
                                    })
                                );
                            })}
                        </box>
                    </scrollable>
                </box>

                {/* Session Action Footer */}
                <box className="power-actions">
                    <button onClicked={() => sh("ags request lockscreen toggle")}>󰌾 Lock</button>
                    <button onClicked={() => sh("systemctl suspend")}>󰤄 Sleep</button>
                    <button onClicked={() => sh("systemctl reboot")}>󰜉 Reboot</button>
                    <button onClicked={() => App.toggle_window("theme-picker")}>🎨 Themes</button>
                </box>
            </box>
        </window>
    );
}
