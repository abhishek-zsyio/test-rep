-- Window Rules & Layer Rules
-- See https://wiki.hypr.land/Configuring/Window-Rules/

local opaque_apps = {
    "Brave-browser", "firefox", "code-oss", "Code", "code-url-handler",
    "code-insiders-url-handler", "kitty", "org.gnome.Nautilus", "org.kde.dolphin",
    "org.kde.ark", "nwg-look", "qt5ct", "qt6ct", "kvantummanager",
    "org.pulseaudio.pavucontrol", "blueman-manager", "nm-applet",
    "nm-connection-editor", "org.kde.polkit-kde-authentication-agent-1",
    "polkit-gnome-authentication-agent-1", "org.freedesktop.impl.portal.desktop.gtk",
    "org.freedesktop.impl.portal.desktop.hyprland", "[Ss]team", "steamwebhelper",
    "Spotify", "com.github.rafostar.Clapper", "com.github.tchx84.Flatseal",
    "hu.kramo.Cartridges", "com.obsproject.Studio", "gnome-boxes", "discord",
    "WebCord", "ArmCord", "app.drey.Warp", "net.davidotek.pupgui2", "yad",
    "Signal", "io.github.alainm23.planify", "io.gitlab.theevilskeleton.Upscaler",
    "com.github.unrud.VideoDownloader", "io.gitlab.adhami3310.Impression",
    "io.missioncenter.MissionCenter", "io.github.flattool.Warehouse"
}

for _, app in ipairs(opaque_apps) do
    hl.window_rule({
        match = { class = "^(" .. app .. ")$" },
        opacity = "0.90 0.90",
    })
end

local float_classes = {
    "vlc", "kvantummanager", "qt5ct", "qt6ct", "nwg-look", "org.kde.ark",
    "org.pulseaudio.pavucontrol", "waypaper", "blueman-manager", "nm-applet",
    "nm-connection-editor", "org.kde.polkit-kde-authentication-agent-1",
    "Signal", "com.github.rafostar.Clapper", "app.drey.Warp",
    "net.davidotek.pupgui2", "yad", "eog", "io.github.alainm23.planify",
    "io.gitlab.theevilskeleton.Upscaler", "com.github.unrud.VideoDownloader",
    "io.gitlab.adhami3310.Impression", "io.missioncenter.MissionCenter"
}

for _, cls in ipairs(float_classes) do
    hl.window_rule({
        match = { class = "^(" .. cls .. ")$" },
        float = true,
    })
end

-- Specific Title/Class Floating Rules
hl.window_rule({ match = { class = "^(org.kde.dolphin)$", title = "^(Progress Dialog — Dolphin)$" }, float = true })
hl.window_rule({ match = { class = "^(org.kde.dolphin)$", title = "^(Copying — Dolphin)$" }, float = true })
hl.window_rule({ match = { class = "^(firefox)$", title = "^(Picture-in-Picture)$" }, float = true })
hl.window_rule({ match = { class = "^(firefox)$", title = "^(Library)$" }, float = true })
hl.window_rule({ match = { class = "^(kitty)$", title = "^(top)$" }, float = true })
hl.window_rule({ match = { class = "^(kitty)$", title = "^(btop)$" }, float = true })
hl.window_rule({ match = { class = "^(kitty)$", title = "^(htop)$" }, float = true })

-- SwayNotificationCenter
hl.window_rule({
    match = { title = "^(SwayNotificationCenter)$" },
    float = true,
    no_focus = true,
    no_anim = true,
    no_border = true,
    opacity = "0.1",
})

-- Suppress maximize
hl.window_rule({
    match = { class = ".*" },
    suppress_event = "maximize",
})

-- Fix XWayland Dragging
hl.window_rule({
    match = { class = "^$", title = "^$", xwayland = 1, floating = 1, fullscreen = 0, pinned = 0 },
    no_focus = true,
})

-- Layer Rules
hl.layer_rule({ match = { namespace = "rofi" }, blur = true, ignore_zero = true, ignore_alpha = 0.5 })
hl.layer_rule({ match = { namespace = "notifications" }, blur = true, ignore_zero = true, ignore_alpha = 0.5 })
hl.layer_rule({ match = { namespace = "logout_dialog" }, blur = true })
hl.layer_rule({ match = { namespace = "waybar" }, blur = true })
