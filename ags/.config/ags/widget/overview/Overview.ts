import { Widget, Astal } from "astal/gtk3";
import { bind } from "astal";
import hyprland from "../../services/hyprland";

export function Overview() {
    const clients = bind(hyprland, "clients");
    const activeWs = bind(hyprland, "focusedWorkspace");

    return (
        <window
            name="overview"
            anchor={
                Astal.WindowAnchor.TOP |
                Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT
            }
            layer={Astal.Layer.OVERLAY}
            keymode={Astal.Keymode.EXCLUSIVE}
            visible={false}
        >
            <box centerBox className="overview">
                <box className="workspaces-grid">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((wsId) =>
                        Widget.Button({
                            className: activeWs.as((ws) =>
                                `workspace-box ${ws && ws.id === wsId ? "active" : ""}`
                            ),
                            onClicked: () => {
                                hyprland.dispatch("workspace", wsId.toString());
                                App.toggle_window("overview");
                            },
                            child: Widget.Box({
                                vertical: true,
                                children: [
                                    Widget.Label({ label: `Workspace ${wsId}` }),
                                    Widget.Box({
                                        vertical: true,
                                        children: clients.as((cList) =>
                                            cList
                                                .filter((c) => c.workspace && c.workspace.id === wsId)
                                                .map((c) =>
                                                    Widget.Label({
                                                        className: "client-title",
                                                        label: c.title || c.class,
                                                    })
                                                )
                                        ),
                                    }),
                                ],
                            }),
                        })
                    )}
                </box>
            </box>
        </window>
    );
}
