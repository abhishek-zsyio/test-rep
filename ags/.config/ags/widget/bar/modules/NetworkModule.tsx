import { bind } from "astal";
import { network } from "../../services/network";

export function NetworkModule() {
  return (
    <box className="network-module">
      <label label={bind(network, "primary").as((p) => (p === 1 ? "WiFi" : "Wired"))} />
    </box>
  );
}
