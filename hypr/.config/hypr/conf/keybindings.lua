-- Keybindings Configuration (macOS Style: SUPER = Cmd)

local mainMod = "SUPER"

-- Core Applications
hl.bind({ mod = mainMod, key = "RETURN", dispatcher = "exec", arg = "kitty" })
hl.bind({ mod = mainMod, key = "E", dispatcher = "exec", arg = "nautilus" })
hl.bind({ mod = mainMod, key = "SPACE", dispatcher = "exec", arg = "walker" })

-- Window Management
hl.bind({ mod = mainMod, key = "Q", dispatcher = "killactive" })
hl.bind({ mod = mainMod, key = "V", dispatcher = "togglefloating" })
hl.bind({ mod = mainMod, key = "F", dispatcher = "fullscreen", arg = "0" })
hl.bind({ mod = mainMod, key = "P", dispatcher = "pseudo" })
hl.bind({ mod = mainMod, key = "J", dispatcher = "togglesplit" })

-- Focus Movement
hl.bind({ mod = mainMod, key = "left", dispatcher = "movefocus", arg = "l" })
hl.bind({ mod = mainMod, key = "right", dispatcher = "movefocus", arg = "r" })
hl.bind({ mod = mainMod, key = "up", dispatcher = "movefocus", arg = "u" })
hl.bind({ mod = mainMod, key = "down", dispatcher = "movefocus", arg = "d" })

-- Window Movement
hl.bind({ mod = mainMod .. " SHIFT", key = "left", dispatcher = "movewindow", arg = "l" })
hl.bind({ mod = mainMod .. " SHIFT", key = "right", dispatcher = "movewindow", arg = "r" })
hl.bind({ mod = mainMod .. " SHIFT", key = "up", dispatcher = "movewindow", arg = "u" })
hl.bind({ mod = mainMod .. " SHIFT", key = "down", dispatcher = "movewindow", arg = "d" })

-- AGS Shell Toggles
hl.bind({ mod = mainMod, key = "C", dispatcher = "exec", arg = "ags request control-center toggle" })
hl.bind({ mod = mainMod, key = "UP", dispatcher = "exec", arg = "ags request overview toggle" })
hl.bind({ mod = mainMod .. " SHIFT", key = "T", dispatcher = "exec", arg = "ags request theme-picker toggle" })
hl.bind({ mod = mainMod .. " SHIFT", key = "S", dispatcher = "exec", arg = "ags request screenshot toggle" })

-- Hardware Media & Brightness Controls
hl.bind({ mod = "", key = "XF86AudioRaiseVolume", dispatcher = "exec", arg = "volume --inc" })
hl.bind({ mod = "", key = "XF86AudioLowerVolume", dispatcher = "exec", arg = "volume --dec" })
hl.bind({ mod = "", key = "XF86AudioMute", dispatcher = "exec", arg = "volume --toggle" })
hl.bind({ mod = "", key = "XF86MonBrightnessUp", dispatcher = "exec", arg = "brightness --inc" })
hl.bind({ mod = "", key = "XF86MonBrightnessDown", dispatcher = "exec", arg = "brightness --dec" })

-- Workspaces Switch & Move (1-9)
for i = 1, 9 do
    hl.bind({ mod = mainMod, key = tostring(i), dispatcher = "workspace", arg = tostring(i) })
    hl.bind({ mod = mainMod .. " SHIFT", key = tostring(i), dispatcher = "movetoworkspace", arg = tostring(i) })
end

-- Mouse Binds (Move/Resize)
hl.bindm({ mod = mainMod, key = "mouse:272", dispatcher = "movewindow" })
hl.bindm({ mod = mainMod, key = "mouse:273", dispatcher = "resizewindow" })
