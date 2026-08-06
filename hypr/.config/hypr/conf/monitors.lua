-- Monitor Configuration
-- Dual-monitor explicit configuration with single-monitor fallback

-- Built-in Laptop Display (Primary 1080p 120Hz)
hl.monitor({
    output   = "eDP-1",
    mode     = "1920x1080@120",
    position = "0x0",
    scale    = "1",
})

-- External Display (Right side)
hl.monitor({
    output   = "HDMI-A-1",
    mode     = "preferred",
    position = "1920x0",
    scale    = "auto",
})

-- Fallback rule for unconfigured / dynamically connected monitors
hl.monitor({
    output   = "",
    mode     = "preferred",
    position = "auto",
    scale    = "auto",
})
