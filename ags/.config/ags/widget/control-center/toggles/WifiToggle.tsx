import { bind } from "astal";
import { network } from "../../../services/network";

export function WifiToggle() {
  return (
    <button
      className="toggle-button"
      onClicked={() => network.wifi?.scan()}
    >
      <label label={bind(network, "wifi").as((w) => w?.ssid || "WiFi Off")} />
    </button>
  );
}
