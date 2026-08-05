import { Widget } from "astal/gtk3";
import { bind } from "astal";
import battery from "../../../services/battery";

export function BatteryModule() {
    const percent = bind(battery, "percentage").as((p) => Math.round(p * 100));
    const charging = bind(battery, "charging");

    return Widget.Box({
        className: "module battery",
        children: [
            Widget.Label({
                label: percent.as((p) => `${p}%`),
            }),
            Widget.Label({
                label: charging.as((c) => (c ? " ⚡" : "")),
            }),
        ],
    });
}
