-- Hyprland General Settings & Theme Options
-- See https://wiki.hypr.land/Configuring/Variables/

hl.config({
    general = {
        gaps_in = 5,
        gaps_out = 5,
        border_size = 3,
        col = {
            active_border = { colors = { "rgba(8839efee)", "rgba(e64553ee)" }, angle = 45 },
            inactive_border = "rgba(5c5f77aa)",
        },
        resize_on_border = false,
        allow_tearing = false,
        layout = "dwindle",
    },

    decoration = {
        rounding = 0,
        rounding_power = 0,
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
            border_inactive = "rgba(6a9589b0)",
            border_active = { colors = { "rgba(dcd7baee)", "rgba(957fb8b0)", "rgba(957fb8b0)", "rgba(dcd7baee)" }, angle = 45 },
        },
        groupbar = {
            col = {
                active = "rgba(957fb8cc)",
                inactive = "rgba(717c7c99)",
            },
            font_size = 10,
            text_color = "rgba(1f1f28ff)",
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

