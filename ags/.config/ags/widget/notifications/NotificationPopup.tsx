import { Widget, Astal } from "astal/gtk3";
import { bind } from "astal";
import notifd from "../../services/notifications";

export function NotificationPopup() {
    const notifications = bind(notifd, "notifications");

    return (
        <window
            name="notifications-popup"
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
            layer={Astal.Layer.TOP}
        >
            <box vertical className="notifications-popup-container">
                {notifications.as((nList) =>
                    nList.slice(0, 3).map((n) =>
                        Widget.Box({
                            className: "notification-popup",
                            vertical: true,
                            children: [
                                Widget.Label({ className: "notif-title", label: n.summary }),
                                Widget.Label({ className: "notif-body", label: n.body }),
                            ],
                        })
                    )
                )}
            </box>
        </window>
    );
}
