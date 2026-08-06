-- Hyprland Main Configuration (Lua Format v0.56+)
-- Abhishek's Hyprland Desktop Configuration

local home = os.getenv("HOME") or ""
local config_dir = home .. "/.config/hypr/"

-- Ensure package.path includes ~/.config/hypr/ for require calls
package.path = config_dir .. "?.lua;" .. config_dir .. "?/init.lua;" .. package.path

local function load_file(path)
    local status, err = pcall(dofile, path)
    if not status then
        print("[Hyprland Config Warning] Could not load: " .. path .. " (" .. tostring(err) .. ")")
    end
end

-- Load hardware environment profile & active theme colors
load_file(home .. "/.config/hypr/hardware/active.lua")
load_file(home .. "/.config/themes/active/hypr.lua")

-- Sourcing core configurations
require("conf.monitors")
require("conf.options")
require("conf.animations")
require("conf.windowrules")
require("conf.keybindings")
require("conf.autostart")
