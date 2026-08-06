-- Monitor Configurations (Optimized for VM & Physical Displays)
-- See https://wiki.hypr.land/Configuring/Monitors/

-- Default fallback rule for all displays & VM dynamic res resizing
hl.monitor({
    output   = "",
    mode     = "preferred",
    position = "auto",
    scale    = "auto",
})

-- Specific Virtual Machine Display Outputs (QEMU / KVM / VirtualBox / VMware)
hl.monitor({
    output   = "Virtual-1",
    mode     = "preferred",
    position = "auto",
    scale    = "1",
})

hl.monitor({
    output   = "VGA-1",
    mode     = "preferred",
    position = "auto",
    scale    = "1",
})
