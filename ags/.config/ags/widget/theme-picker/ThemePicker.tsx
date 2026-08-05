import { Widget, Astal } from "astal/gtk3";
import { activeTheme, setTheme } from "../../services/theme";

const THEMES = [
    { id: "ghibli-cream", name: "Ghibli Cream", color: "#458588" },
    { id: "vercel", name: "Vercel Dark", color: "#ffffff" },
    { id: "rose-pine", name: "Rose Pine", color: "#c4a7e7" },
    { id: "gruvbox", name: "Gruvbox", color: "#fe8019" },
    { id: "catppuccin", name: "Catppuccin", color: "#cba6f7" },
    { id: "tokyo-night", name: "Tokyo Night", color: "#7aa2f7" },
    { id: "nord", name: "Nord", color: "#88c0d0" },
];

export function ThemePicker() {
    const current = activeTheme();

    return (
        <window
            name="theme-picker"
            anchor={Astal.WindowAnchor.CENTER}
            layer={Astal.Layer.OVERLAY}
            keymode={Astal.Keymode.EXCLUSIVE}
            visible={false}
        >
            <box vertical className="theme-picker">
                <label className="picker-title" label="Select Theme" />
                <box className="themes-list">
                    {THEMES.map((theme) =>
                        Widget.Button({
                            className: current.as((c) =>
                                `theme-card ${c === theme.id ? "selected" : ""}`
                            ),
                            onClicked: () => setTheme(theme.id),
                            child: Widget.Box({
                                children: [
                                    Widget.Label({ label: `⬤ `, css: `color: ${theme.color};` }),
                                    Widget.Label({ label: theme.name }),
                                ],
                            }),
                        })
                    )}
                </box>
            </box>
        </window>
    );
}
