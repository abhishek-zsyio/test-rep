-- Autostart Processes

hl.on("hyprland.start", function ()
    hl.dispatch(hl.dsp.exec_cmd("swww-daemon"))
    hl.dispatch(hl.dsp.exec_cmd("ags run"))
    hl.dispatch(hl.dsp.exec_cmd("elephant"))
    hl.dispatch(hl.dsp.exec_cmd("wl-paste --watch cliphist store"))
    hl.dispatch(hl.dsp.exec_cmd("hypridle"))
    hl.dispatch(hl.dsp.exec_cmd("nm-applet --indicator"))
    hl.dispatch(hl.dsp.exec_cmd("/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1"))
end)
