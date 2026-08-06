import { Astal, Gtk } from "astal/gtk3";
import { WifiToggle } from "./toggles/WifiToggle";
import { BluetoothToggle } from "./toggles/BluetoothToggle";
import { VolumeSlider } from "./toggles/VolumeSlider";

export function ControlCenter() {
  return (
    <window
      name="control-center"
      className="control-center-window"
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      visible={false}
    >
      <box className="control-center-container" vertical>
        <label className="header" label="Control Center" />
        <WifiToggle />
        <BluetoothToggle />
        <VolumeSlider />
      </box>
    </window>
  );
}
