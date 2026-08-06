import { Astal, Gtk } from "astal/gtk3";
import { switchTheme } from "../../services/theme";

const themesList = ["rose-pine", "gruvbox", "catppuccin", "tokyo-night", "nord"];

export function ThemePicker() {
  return (
    <window
      name="theme-picker"
      className="theme-picker-window"
      layer={Astal.Layer.TOP}
      anchor={Astal.WindowAnchor.CENTER}
      visible={false}
    >
      <box className="theme-picker-container" vertical>
        <label className="header" label="Select Theme" />
        <box className="theme-buttons" vertical>
          {themesList.map((t) => (
            <button className="theme-button" onClicked={() => switchTheme(t)}>
              <label label={t} />
            </button>
          ))}
        </box>
      </box>
    </window>
  );
}
