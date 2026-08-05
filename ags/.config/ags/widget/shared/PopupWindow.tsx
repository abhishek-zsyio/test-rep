import { Astal, App } from "astal/gtk3";

export function PopupWindow({
    name,
    child,
    namespace = name,
    anchor = Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,
}: {
    name: string;
    child: JSX.Element;
    namespace?: string;
    anchor?: Astal.WindowAnchor;
}) {
    return (
        <window
            name={name}
            namespace={namespace}
            anchor={anchor}
            layer={Astal.Layer.TOP}
            keymode={Astal.Keymode.EXCLUSIVE}
            visible={false}
            application={App}
        >
            {child}
        </window>
    );
}
