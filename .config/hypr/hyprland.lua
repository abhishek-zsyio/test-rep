-- Hyprland Main Configuration File (Lua format - Hyprland 0.55+)
-- See https://wiki.hypr.land/Configuring/Start/

local config_dir = os.getenv("HOME") .. "/.config/hypr/lua"
package.path = package.path .. ";" .. config_dir .. "/?.lua"

require("monitors")
require("env")
require("autostart")
require("settings")
require("animations")
require("windowrules")
require("keybinds")
