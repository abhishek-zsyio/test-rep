import { bind } from "astal";
import { battery } from "../../services/battery";

export function BatteryModule() {
  return (
    <box className="battery-module">
      <label label={bind(battery, "percentage").as((p) => `${Math.round(p * 100)}%`)} />
    </box>
  );
}
