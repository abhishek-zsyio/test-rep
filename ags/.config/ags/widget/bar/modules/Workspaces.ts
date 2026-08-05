import { Widget } from "astal/gtk3";
import { bind } from "astal/gtk3";
import hyprland from "../../../services/hyprland";

export function Workspaces() {
    const activeWs = bind(hyprland, "focusedWorkspace");

    return Widget.Box({
        className: "module workspaces",
        children: Array.from({ length: 10 }, (_, i) => i + 1).map((id) =>
            Widget.Button({
                className: activeWs.as((ws) =>
                    `workspace-btn ${ws && ws.id === id ? "active" : ""}`
                ),
                onClicked: () => hyprland.dispatch("workspace", id.toString()),
                child: Widget.Label({ label: id.toString() }),
            })
        ),
    });
}
