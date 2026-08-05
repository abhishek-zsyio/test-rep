import { Widget, Astal } from "astal/gtk3";
import { sh } from "../../utils/exec";

const DOCK_APPS = [
    { name: "Terminal", icon: "utilities-terminal", cmd: "kitty" },
    { name: "Files", icon: "system-file-manager", cmd: "nautilus" },
    { name: "Browser", icon: "firefox", cmd: "firefox" },
    { name: "Code", icon: "text-editor", cmd: "code" },
];

export function Dock() {
    return (
        <window
            name="dock"
            anchor={Astal.WindowAnchor.BOTTOM}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
        >
            <box className="dock">
                {DOCK_APPS.map((app) =>
                    Widget.Button({
                        className: "dock-item",
                        tooltipText: app.name,
                        onClicked: () => sh(app.cmd),
                        child: Widget.Icon({
                            icon: app.icon,
                            pixelSize: 32,
                        }),
                    })
                )}
            </box>
        </window>
    );
}
