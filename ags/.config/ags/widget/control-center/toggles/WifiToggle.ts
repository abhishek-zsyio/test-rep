import { Widget } from "astal/gtk3";
import { bind } from "astal";
import network from "../../../services/network";

export function WifiToggle() {
    const wifi = bind(network, "wifi");

    return Widget.Button({
        className: wifi.as((w) => `toggle-btn ${w && w.enabled ? "active" : ""}`),
        onClicked: () => {
            const w = network.wifi;
            if (w) w.set_enabled(!w.enabled);
        },
        child: Widget.Label({
            label: wifi.as((w) => (w && w.enabled ? "󰤨 Wi-Fi On" : "󰤭 Wi-Fi Off")),
        }),
    });
}
