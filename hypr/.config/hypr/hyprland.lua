-- Hyprland Main Configuration (Lua Format v0.56+)
-- Abhishek's Hyprland Desktop Configuration

local function safe_require(module)
    local status, err = pcall(require, module)
    if not status then
        print("[Hyprland Config Warning] Failed to load module '" .. tostring(module) .. "': " .. tostring(err))
    end
end

-- Add ~/.config/themes/ to package.path so themes can be required cleanly
local home = os.getenv("HOME") or ""
package.path = home .. "/.config/themes/?.lua;" .. home .. "/.config/themes/?/init.lua;" .. package.path

-- Safely require hardware profile and theme colors
safe_require("hardware/active")
safe_require("active/hypr")

-- Safely require core configurations (isolated scope per Hyprland wiki)
safe_require("conf/monitors")
safe_require("conf/options")
safe_require("conf/animations")
safe_require("conf/windowrules")
safe_require("conf/keybindings")
safe_require("conf/autostart")
