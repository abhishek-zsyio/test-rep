-- Lenovo IdeaPad Gaming 3 Hardware Profile
-- Hybrid GPU: NVIDIA GTX 1650 Mobile (discrete) + AMD Radeon Vega (integrated)

hl.env("LIBVA_DRIVER_NAME", "nvidia")
hl.env("__GLX_VENDOR_LIBRARY_NAME", "nvidia")
hl.env("GBM_BACKEND", "nvidia-drm")
hl.env("WLR_NO_HARDWARE_CURSORS", "1")

hl.env("XCURSOR_SIZE", "24")
hl.env("HYPRCURSOR_SIZE", "24")
