import { Variable } from "astal";
import { GLib } from "astal";

const time = Variable("").poll(1000, () =>
  GLib.DateTime.new_now_local().format("%b %d  %H:%M:%S")!!
);

export function Clock() {
  return (
    <box className="clock">
      <label label={time()} />
    </box>
  );
}
