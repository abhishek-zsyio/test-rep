-- Keybindings & Controls Configuration
-- See https://wiki.hypr.land/Configuring/Binds/

local terminal = "ghostty"
local fileManager = "dolphin"
local mainMod = "SUPER"

----------------------------
---- APPLICATION SHORTCUTS -
----------------------------
hl.bind(mainMod .. " + T", hl.dsp.exec_cmd(terminal))
hl.bind(mainMod .. " + E", hl.dsp.exec_cmd(fileManager))
hl.bind(mainMod .. " + F", hl.dsp.exec_cmd("firefox"))
hl.bind(mainMod .. " + L", hl.dsp.exec_cmd("hyprlock"))
hl.bind(mainMod .. " + Q", hl.dsp.exec_cmd("hyprctl dispatch killactive"))
hl.bind(mainMod .. " + SPACE", hl.dsp.exec_cmd("pkill -x rofi || ~/.config/rofi/launcher/launcher.sh"))
hl.bind(mainMod .. " + BACKSPACE", hl.dsp.exec_cmd("pkill -x rofi || ~/.config/rofi/powermenu/powermenu.sh"))
hl.bind("CTRL + ALT + W", hl.dsp.exec_cmd("killall waybar || waybar"))
hl.bind(mainMod .. " + A", hl.dsp.exec_cmd("waypaper"))
hl.bind(mainMod .. " + N", hl.dsp.exec_cmd("ags -t sidepanel"))
hl.bind(mainMod .. " + SHIFT + T", hl.dsp.exec_cmd("/home/abhishek/.config/scripts/mode_toggle.py"))
hl.bind(mainMod .. " + SHIFT + F", hl.dsp.exec_cmd("/home/abhishek/.config/scripts/focus_mode.py"))

-----------------------------------
---- WINDOW MANAGEMENT & FOCUS ----
-----------------------------------
hl.bind(mainMod .. " + W", hl.dsp.window.float({ action = "toggle" }))
hl.bind(mainMod .. " + J", hl.dsp.exec_cmd("hyprctl dispatch togglesplit"))
hl.bind("ALT + Return", hl.dsp.exec_cmd("hyprctl dispatch fullscreen"))

-- Focus movement
hl.bind(mainMod .. " + Left", hl.dsp.focus({ direction = "left" }))
hl.bind(mainMod .. " + Right", hl.dsp.focus({ direction = "right" }))
hl.bind(mainMod .. " + Up", hl.dsp.focus({ direction = "up" }))
hl.bind(mainMod .. " + Down", hl.dsp.focus({ direction = "down" }))

-- Resize window (repeatable)
hl.bind(mainMod .. " + SHIFT + Right", hl.dsp.exec_cmd("hyprctl dispatch resizeactive 30 0"), { ["repeat"] = true })
hl.bind(mainMod .. " + SHIFT + Left", hl.dsp.exec_cmd("hyprctl dispatch resizeactive -30 0"), { ["repeat"] = true })
hl.bind(mainMod .. " + SHIFT + Up", hl.dsp.exec_cmd("hyprctl dispatch resizeactive 0 -30"), { ["repeat"] = true })
hl.bind(mainMod .. " + SHIFT + Down", hl.dsp.exec_cmd("hyprctl dispatch resizeactive 0 30"), { ["repeat"] = true })

-- Move focus window around workspace
hl.bind(mainMod .. " + SHIFT + CTRL + Left", hl.dsp.exec_cmd("hyprctl dispatch movewindow l"))
hl.bind(mainMod .. " + SHIFT + CTRL + Right", hl.dsp.exec_cmd("hyprctl dispatch movewindow r"))
hl.bind(mainMod .. " + SHIFT + CTRL + Up", hl.dsp.exec_cmd("hyprctl dispatch movewindow u"))
hl.bind(mainMod .. " + SHIFT + CTRL + Down", hl.dsp.exec_cmd("hyprctl dispatch movewindow d"))

-- Mouse actions
hl.bind(mainMod .. " + mouse:272", hl.dsp.exec_cmd("hyprctl dispatch movewindow"))
hl.bind(mainMod .. " + mouse:273", hl.dsp.exec_cmd("hyprctl dispatch resizewindow"))
hl.bind(mainMod .. " + Z", hl.dsp.exec_cmd("hyprctl dispatch movewindow"))
hl.bind(mainMod .. " + X", hl.dsp.exec_cmd("hyprctl dispatch resizewindow"))

---------------------------------
---- WORKSPACES & SWITCHING -----
---------------------------------
for i = 1, 9 do
    hl.bind(mainMod .. " + " .. i, hl.dsp.focus({ workspace = tostring(i) }))
    hl.bind(mainMod .. " + SHIFT + " .. i, hl.dsp.exec_cmd("hyprctl dispatch movetoworkspace " .. i))
    hl.bind(mainMod .. " + ALT + " .. i, hl.dsp.exec_cmd("hyprctl dispatch movetoworkspacesilent " .. i))
end
hl.bind(mainMod .. " + 0", hl.dsp.focus({ workspace = "10" }))
hl.bind(mainMod .. " + SHIFT + 0", hl.dsp.exec_cmd("hyprctl dispatch movetoworkspace 10"))
hl.bind(mainMod .. " + ALT + 0", hl.dsp.exec_cmd("hyprctl dispatch movetoworkspacesilent 10"))

-- Scroll workspaces
hl.bind(mainMod .. " + mouse_down", hl.dsp.focus({ workspace = "e+1" }))
hl.bind(mainMod .. " + mouse_up", hl.dsp.focus({ workspace = "e-1" }))

-- Special workspace
hl.bind(mainMod .. " + S", hl.dsp.exec_cmd("hyprctl dispatch togglespecialworkspace magic"))
hl.bind(mainMod .. " + SHIFT + S", hl.dsp.exec_cmd("hyprctl dispatch movetoworkspace special:magic"))

------------------------
---- MEDIA CONTROLS ----
------------------------
hl.bind("XF86AudioNext", hl.dsp.exec_cmd("playerctl next"), { locked = true })
hl.bind("XF86AudioPause", hl.dsp.exec_cmd("playerctl play-pause"), { locked = true })
hl.bind("XF86AudioPlay", hl.dsp.exec_cmd("playerctl play-pause"), { locked = true })
hl.bind("XF86AudioPrev", hl.dsp.exec_cmd("playerctl previous"), { locked = true })

------------------------------------
---- BRIGHTNESS & VOLUME KEYS ------
------------------------------------
hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("sh -c '/home/abhishek/.config/hypr/scripts/volumecontrol.sh -o i'"), { ["repeat"] = true, locked = true })
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_cmd("sh -c '/home/abhishek/.config/hypr/scripts/volumecontrol.sh -o d'"), { ["repeat"] = true, locked = true })
hl.bind("XF86AudioMute", hl.dsp.exec_cmd("sh -c '/home/abhishek/.config/hypr/scripts/volumecontrol.sh -o m'"), { locked = true })
hl.bind("XF86AudioMicMute", hl.dsp.exec_cmd("sh -c '/home/abhishek/.config/hypr/scripts/volumecontrol.sh -i m'"), { locked = true })

hl.bind("XF86MonBrightnessUp", hl.dsp.exec_cmd("sh -c '/home/abhishek/.config/hypr/scripts/brightnesscontrol.sh -o i'"), { ["repeat"] = true, locked = true })
hl.bind("XF86MonBrightnessDown", hl.dsp.exec_cmd("sh -c '/home/abhishek/.config/hypr/scripts/brightnesscontrol.sh -o d'"), { ["repeat"] = true, locked = true })

-- Function key fallback
hl.bind("F10", hl.dsp.exec_cmd("/home/abhishek/.config/hypr/scripts/volumecontrol.sh -o m"), { locked = true })
hl.bind("F11", hl.dsp.exec_cmd("/home/abhishek/.config/hypr/scripts/volumecontrol.sh -o d"), { ["repeat"] = true })
hl.bind("F12", hl.dsp.exec_cmd("/home/abhishek/.config/hypr/scripts/volumecontrol.sh -o i"), { ["repeat"] = true })
hl.bind("F1", hl.dsp.exec_cmd("sh -c '/home/abhishek/.config/hypr/scripts/brightnesscontrol.sh -o d'"))
hl.bind("F3", hl.dsp.exec_cmd("sh -c '/home/abhishek/.config/hypr/scripts/brightnesscontrol.sh -o i'"))

--------------------
---- SCREENSHOTS ---
--------------------
hl.bind(mainMod .. " + P", hl.dsp.exec_cmd("/home/abhishek/.config/hypr/scripts/screenshot.sh s"), { locked = true })
hl.bind(mainMod .. " + CTRL + P", hl.dsp.exec_cmd("/home/abhishek/.config/hypr/scripts/screenshot.sh sf"), { locked = true })
hl.bind(mainMod .. " + ALT + P", hl.dsp.exec_cmd("/home/abhishek/.config/hypr/scripts/screenshot.sh m"), { locked = true })
hl.bind("Print", hl.dsp.exec_cmd("/home/abhishek/.config/hypr/scripts/screenshot.sh p"), { locked = true })

-----------------------------
---- CLIPBOARD & UTILITIES --
-----------------------------
hl.bind(mainMod .. " + SHIFT + V", hl.dsp.exec_cmd("cliphist list | rofi -dmenu | cliphist decode | wl-copy"))
hl.bind(mainMod .. " + ALT + Left", hl.dsp.exec_cmd("/home/abhishek/.config/scripts/change_wallpaper.py -p"))
hl.bind(mainMod .. " + ALT + Right", hl.dsp.exec_cmd("/home/abhishek/.config/scripts/change_wallpaper.py -0"))
hl.bind(mainMod .. " + ALT + I", hl.dsp.exec_cmd("/home/abhishek/.config/scripts/change_wallpaper.py -i"))

-----------------------
---- MOUSE BUTTONS ----
-----------------------
hl.bind("mouse:275", hl.dsp.exec_cmd("spotify"))
hl.bind("mouse:276", hl.dsp.exec_cmd("discord"))
