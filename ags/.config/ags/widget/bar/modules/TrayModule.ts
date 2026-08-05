import { Widget } from "astal/gtk3";
import { bind } from "astal/gtk3";
import tray from "../../../services/tray";

export function TrayModule() {
    const items = bind(tray, "items");

    return Widget.Box({
        className: "module tray",
        children: items.as((itemList) =>
            itemList.map((item) =>
                Widget.Button({
                    className: "tray-item",
                    tooltipText: bind(item, "tooltipMarkup"),
                    onClicked: (btn) => item.activate(0, 0),
                    child: Widget.Icon({
                        gicon: bind(item, "gicon"),
                    }),
                })
            )
        ),
    });
}
