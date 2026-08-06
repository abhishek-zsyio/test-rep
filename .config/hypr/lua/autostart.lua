-- Autostart Applications & Background Services
-- See https://wiki.hypr.land/Configuring/Autostart/

hl.on("hyprland.start", function()
    hl.exec_cmd("swww-daemon")
    hl.exec_cmd("hyprpaper")
    hl.exec_cmd("python3 ~/.config/scripts/change_wallpaper.py -0")
    hl.exec_cmd("swayosd-server")
    hl.exec_cmd("ags run --gtk 3")
    hl.exec_cmd("hyprctl setcursor Bibata-Modern-Ice 24")
    hl.exec_cmd("wl-paste --type text --watch cliphist store")
    hl.exec_cmd("wl-paste --type image --watch cliphist store")
    hl.exec_cmd("systemctl --user start hyprpolkitagent")
    hl.exec_cmd("kdeconnect-indicator")
end)
