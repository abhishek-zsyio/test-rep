-- Autostart Processes

hl.on("hyprland.start", function ()
    hl.exec_cmd("swww-daemon &")
    hl.exec_cmd("ags run &")
    hl.exec_cmd("elephant &")
    hl.exec_cmd("wl-paste --watch cliphist store &")
    hl.exec_cmd("hypridle &")
    hl.exec_cmd("nm-applet --indicator &")
    hl.exec_cmd("/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1 &")
end)
