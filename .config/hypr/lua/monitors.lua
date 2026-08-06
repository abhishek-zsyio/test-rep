-- Monitor Configurations (Optimized for Laptops, Desktop Displays & VMs)
-- See https://wiki.hypr.land/Configuring/Monitors/

-- Default wildcard fallback rule
hl.monitor({
    output   = "",
    mode     = "preferred",
    position = "auto",
    scale    = 1,
})

-- Physical Display Outputs
hl.monitor({ output = "eDP-1", mode = "preferred", position = "auto", scale = 1 })
hl.monitor({ output = "HDMI-A-1", mode = "preferred", position = "auto", scale = 1 })
hl.monitor({ output = "HDMI-A-2", mode = "preferred", position = "auto", scale = 1 })
hl.monitor({ output = "DP-1", mode = "preferred", position = "auto", scale = 1 })
hl.monitor({ output = "DP-2", mode = "preferred", position = "auto", scale = 1 })

-- Virtual Machine Displays (QEMU / KVM / VirtualBox / VMware)
hl.monitor({ output = "Virtual-1", mode = "preferred", position = "auto", scale = 1 })
hl.monitor({ output = "Virtual1", mode = "preferred", position = "auto", scale = 1 })
hl.monitor({ output = "VGA-1", mode = "preferred", position = "auto", scale = 1 })
