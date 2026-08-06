-- Window & Layer Rules

-- Floating window rules
hl.window_rule({
    name = "float-utilities",
    match = { class = "nwg-look|qt5ct|qt6ct|pavucontrol|blueman-manager" },
    float = true,
})

hl.window_rule({
    name = "walker-float",
    match = { class = "walker" },
    float = true,
})

-- Opacity rules
hl.window_rule({
    name = "kitty-opacity",
    match = { class = "kitty" },
    opacity = 0.95,
})

-- Layer rules for AGS shell components (blur & ignorezero)
hl.layer_rule({
    name = "ags-blur",
    match = { target = "ags-.*" },
    blur = true,
    ignore_zero = true,
})
