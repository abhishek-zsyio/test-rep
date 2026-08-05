import { Widget } from "astal/gtk3";
import { bind } from "astal/gtk3";
import bluetooth from "../../../services/bluetooth";

export function BluetoothToggle() {
    const isPowered = bind(bluetooth, "isPowered");

    return Widget.Button({
        className: isPowered.as((p) => `toggle-btn ${p ? "active" : ""}`),
        onClicked: () => bluetooth.toggle(),
        child: Widget.Label({
            label: isPowered.as((p) => (p ? "󰂯 Bluetooth On" : "󰂲 Bluetooth Off")),
        }),
    });
}
