-- Hyprland Lua Configuration Entry Point (Hyprland 0.55+)

-- Source modular config files
pcall(function() hl.source("conf/colors.conf") end)
pcall(function() hl.source("conf/env.conf") end)
pcall(function() hl.source("conf/monitors.conf") end)
pcall(function() hl.source("conf/options.conf") end)
pcall(function() hl.source("conf/animations.conf") end)
pcall(function() hl.source("conf/keybindings.conf") end)
pcall(function() hl.source("conf/startup.conf") end)

-- Native Lua Window Rules (Hyprland 0.55+)
hl.window_rule({ match = { class = "nwg-look" }, float = true })
hl.window_rule({ match = { class = "qt5ct" }, float = true })
hl.window_rule({ match = { class = "qt6ct" }, float = true })
hl.window_rule({ match = { class = "org.gnome.Nautilus" }, float = true })
hl.window_rule({ match = { class = "pavucontrol" }, float = true })
hl.window_rule({ match = { class = "blueman-manager" }, float = true })
hl.window_rule({ match = { class = "nm-connection-editor" }, float = true })
hl.window_rule({ match = { title = "Open File" }, float = true })
hl.window_rule({ match = { title = "Save File" }, float = true })
hl.window_rule({ match = { title = "Volume Control" }, float = true })
hl.window_rule({ match = { title = "Picture-in-Picture" }, float = true, pin = true })

-- Terminal subtle transparency
hl.window_rule({ match = { class = "kitty" }, opacity = "0.95 0.90" })

-- Prevent idle sleep during video playback
hl.window_rule({ match = { class = "mpv" }, idle_inhibit = "focus" })
hl.window_rule({ match = { class = "firefox" }, idle_inhibit = "fullscreen" })

-- Walker Launcher rules
hl.window_rule({ match = { class = "walker" }, float = true, stay_focused = true })

-- AGS layer rules for blur and animation
hl.layer_rule({ match = { namespace = "ags-bar" }, blur = true, ignore_zero = true })
hl.layer_rule({ match = { namespace = "ags-control-center" }, blur = true, ignore_zero = true })
hl.layer_rule({ match = { namespace = "ags-notifications" }, blur = true, ignore_zero = true })
hl.layer_rule({ match = { namespace = "ags-dock" }, blur = true, ignore_zero = true })
hl.layer_rule({ match = { namespace = "ags-overview" }, blur = true, ignore_zero = true })
hl.layer_rule({ match = { namespace = "ags-lockscreen" }, blur = true, ignore_zero = true })
hl.layer_rule({ match = { namespace = "ags-spotlight" }, blur = true, ignore_zero = true })
