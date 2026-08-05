import { Widget } from "astal/gtk3";
import { bind } from "astal/gtk3";
import network from "../../../services/network";

export function NetworkModule() {
    const wifi = bind(network, "wifi");

    return Widget.Box({
        className: "module network",
        child: Widget.Label({
            label: wifi.as((w) => (w ? `󰤨 ${w.ssid || "Connected"}` : "󰤭 Disconnected")),
        }),
    });
}
