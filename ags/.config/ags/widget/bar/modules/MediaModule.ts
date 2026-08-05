import { Widget } from "astal/gtk3";
import { bind } from "astal";
import mpris from "../../../services/mpris";

export function MediaModule() {
    const players = bind(mpris, "players");

    return Widget.Box({
        className: "module media",
        child: players.as((pList) => {
            if (!pList || pList.length === 0) return Widget.Label({ label: "󰝚 Idle" });
            const p = pList[0];
            const title = bind(p, "title");
            const artist = bind(p, "artist");
            return Widget.Label({
                label: title.as((t) => `󰎆 ${t || "Playing"}`),
            });
        }),
    });
}
