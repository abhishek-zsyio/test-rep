-- Hyprland Main Configuration (Lua Format v0.55+)
-- Abhishek's Hyprland Desktop Configuration

local home = os.getenv("HOME") or ""

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
