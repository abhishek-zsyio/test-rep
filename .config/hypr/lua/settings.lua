-- Hyprland General Settings & Theme Options
-- See https://wiki.hypr.land/Configuring/Variables/

hl.config({
    general = {
        gaps_in = 5,
        gaps_out = 5,
        border_size = 2,
        col = {
            active_border = { colors = { "rgba(cba6f7ee)", "rgba(89b4faee)" }, angle = 45 },
            inactive_border = "rgba(5c5f77aa)",
        },
        resize_on_border = false,
        allow_tearing = false,
        layout = "dwindle",
    },

    decoration = {
        rounding = 8,
        rounding_power = 2,
        active_opacity = 1.0,
        inactive_opacity = 1.0,

        shadow = {
            enabled = false,
            range = 4,
            render_power = 3,
            color = "rgba(1a1a1aee)",
        },

        blur = {
            enabled = true,
            size = 6,
            passes = 3,
            new_optimizations = true,
            ignore_opacity = true,
            xray = false,
        },
    },

    dwindle = {
        preserve_split = true,
    },

    master = {
        new_status = "master",
    },

    misc = {
        disable_hyprland_logo = true,
        disable_splash_rendering = true,
        background_color = "0x11111b",
    },

    input = {
        kb_layout = "us",
        follow_mouse = 1,
        sensitivity = 0,

        touchpad = {
            natural_scroll = true,
        },
    },

    cursor = {
        no_hardware_cursors = true,
    },

    group = {
        col = {
            border_inactive = "rgba(5c5f77aa)",
            border_active = { colors = { "rgba(cba6f7ee)", "rgba(89b4faee)" }, angle = 45 },
        },
        groupbar = {
            col = {
                active = "rgba(cba6f7cc)",
                inactive = "rgba(5c5f7799)",
            },
            font_size = 10,
            text_color = "rgba(cdd6f4ff)",
        },
    },
})

-- Plugin Configurations (hl.plugin API)
if hl.plugin then
    if hl.plugin.hyprtrails then
        hl.plugin.hyprtrails.color = "rgba(cba6f790)"
    end
    if hl.plugin.hyprexpo then
        hl.plugin.hyprexpo.columns = 3
        hl.plugin.hyprexpo.gap_size = 5
        hl.plugin.hyprexpo.bg_col = "rgb(111111)"
        hl.plugin.hyprexpo.workspace_method = "center current"
        hl.plugin.hyprexpo.enable_gesture = true
        hl.plugin.hyprexpo.gesture_fingers = 3
        hl.plugin.hyprexpo.gesture_distance = 300
        hl.plugin.hyprexpo.gesture_positive = true
    end
end
