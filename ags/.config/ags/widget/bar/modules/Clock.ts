import { Widget } from "astal/gtk3";
import { Variable, GLib } from "astal";

export function Clock() {
    const time = Variable("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%a %b %e  %H:%M") || ""
    );

    return Widget.Box({
        className: "module clock",
        child: Widget.Label({
            label: time(),
        }),
    });
}
