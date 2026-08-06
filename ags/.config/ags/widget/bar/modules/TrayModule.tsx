import { bind } from "astal";
import { tray } from "../../services/tray";

export function TrayModule() {
  return (
    <box className="tray-module">
      {bind(tray, "items").as((items) =>
        items.map((item) => (
          <button onClicked={() => item.activate(0, 0)}>
            <icon gicon={bind(item, "gicon")} />
          </button>
        ))
      )}
    </box>
  );
}
