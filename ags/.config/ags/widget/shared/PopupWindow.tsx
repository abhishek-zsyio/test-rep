import { Astal, Gtk } from "astal/gtk3";

export function PopupWindow({
  name,
  namespace = name,
  child,
  visible = false,
}: {
  name: string;
  namespace?: string;
  child: JSX.Element;
  visible?: boolean;
}) {
  return (
    <window
      name={name}
      namespace={namespace}
      className="popup-window"
      layer={Astal.Layer.TOP}
      visible={visible}
      keymode={Astal.Keymode.EXCLUSIVE}
    >
      <box className="popup-container">
        {child}
      </box>
    </window>
  );
}
