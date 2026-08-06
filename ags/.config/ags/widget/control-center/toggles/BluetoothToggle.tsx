import { bind } from "astal";
import { bluetooth } from "../../../services/bluetooth";

export function BluetoothToggle() {
  return (
    <button
      className="toggle-button"
      onClicked={() => bluetooth.toggle()}
    >
      <label label={bind(bluetooth, "isPowered").as((p) => p ? "Bluetooth On" : "Bluetooth Off")} />
    </button>
  );
}
