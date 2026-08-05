import { Widget, Astal } from "astal/gtk3";
import { bind } from "astal/gtk3";
import notifd from "../../services/notifications";

export function NotificationCenter() {
    const notifications = bind(notifd, "notifications");

    return (
        <window
            name="notification-center"
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
            layer={Astal.Layer.TOP}
            visible={false}
        >
            <box vertical className="notification-center">
                <box className="header">
                    <label label="Notifications" expand />
                    <button onClicked={() => notifd.get_notifications().forEach((n) => n.dismiss())}>
                        Clear All
                    </button>
                </box>
                <scrollable expand heightRequest={400}>
                    <box vertical>
                        {notifications.as((nList) =>
                            nList.map((n) =>
                                Widget.Box({
                                    className: "notification-item",
                                    vertical: true,
                                    children: [
                                        Widget.Label({ className: "title", label: n.summary }),
                                        Widget.Label({ className: "body", label: n.body }),
                                    ],
                                })
                            )
                        )}
                    </box>
                </scrollable>
            </box>
        </window>
    );
}
