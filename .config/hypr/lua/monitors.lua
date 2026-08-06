-- Monitor Configurations (Optimized for Large Displays & VMs)
-- See https://wiki.hypr.land/Configuring/Monitors/

-- 1080p Full HD Default Resolution (1920x1080) for all monitors
hl.monitor({
    output   = "",
    mode     = "1920x1080@60Hz",
    position = "auto",
    scale    = "1",
})

-- Specific Virtual Machine Display Handles (QEMU / KVM / VirtualBox / VMware)
hl.monitor({
    output   = "Virtual-1",
    mode     = "1920x1080@60Hz",
    position = "auto",
    scale    = "1",
})

hl.monitor({
    output   = "Virtual1",
    mode     = "1920x1080@60Hz",
    position = "auto",
    scale    = "1",
})

hl.monitor({
    output   = "VGA-1",
    mode     = "1920x1080@60Hz",
    position = "auto",
    scale    = "1",
})
