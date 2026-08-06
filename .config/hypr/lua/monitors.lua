-- Monitor Configurations
-- See https://wiki.hypr.land/Configuring/Monitors/

-- Dynamic resolution auto-detection for all monitors and VMs
hl.monitor({
    output   = "",
    mode     = "preferred",
    position = "auto",
    scale    = 1,
})

-- Common Virtual Machine handles (QEMU / KVM / VirtualBox / VMware)
hl.monitor({
    output   = "Virtual-1",
    mode     = "preferred",
    position = "auto",
    scale    = 1,
})

hl.monitor({
    output   = "Virtual1",
    mode     = "preferred",
    position = "auto",
    scale    = 1,
})

hl.monitor({
    output   = "VGA-1",
    mode     = "preferred",
    position = "auto",
    scale    = 1,
})
