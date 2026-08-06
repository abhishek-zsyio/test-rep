import { Astal, Gtk } from "astal/gtk3";
import { sh } from "../../utils/exec";

export function ScreenshotUI() {
  return (
    <window
      name="screenshot"
      className="screenshot-window"
      layer={Astal.Layer.TOP}
      visible={false}
    >
      <box className="screenshot-container">
        <button onClicked={() => sh("grim ~/.cache/screenshot.png")}>
          <label label="Full Capture" />
        </button>
        <button onClicked={() => sh("grim -g "$(slurp)" ~/.cache/screenshot.png")}>
          <label label="Area Capture" />
        </button>
      </box>
    </window>
  );
}
