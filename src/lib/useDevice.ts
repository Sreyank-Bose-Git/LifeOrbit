import { useState, useEffect, useCallback } from "react";
import { DeviceInfo, DeviceViewOverride } from "../types";
import { detectDevice, getSavedDeviceOverride, saveDeviceOverride, triggerHaptic, HapticType } from "./device";

export function useDevice() {
  const [override, setOverrideState] = useState<DeviceViewOverride>(getSavedDeviceOverride);
  const [device, setDevice] = useState<DeviceInfo>(() => detectDevice(getSavedDeviceOverride()));

  useEffect(() => {
    const handleUpdate = () => {
      setDevice(detectDevice(override));
    };

    // Initial update
    handleUpdate();

    // Resize and orientation event listeners
    window.addEventListener("resize", handleUpdate, { passive: true });
    window.addEventListener("orientationchange", handleUpdate, { passive: true });

    // Match media listeners for dark mode & motion
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");

    if (motionMedia.addEventListener) {
      motionMedia.addEventListener("change", handleUpdate);
      darkMedia.addEventListener("change", handleUpdate);
    }

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("orientationchange", handleUpdate);
      if (motionMedia.removeEventListener) {
        motionMedia.removeEventListener("change", handleUpdate);
        darkMedia.removeEventListener("change", handleUpdate);
      }
    };
  }, [override]);

  const setViewOverride = useCallback((newOverride: DeviceViewOverride) => {
    setOverrideState(newOverride);
    saveDeviceOverride(newOverride);
    setDevice(detectDevice(newOverride));
    triggerHaptic("selection");
  }, []);

  const haptic = useCallback((type: HapticType = "light") => {
    triggerHaptic(type);
  }, []);

  return {
    device,
    setViewOverride,
    haptic,
    isMobile: device.isMobile,
    isTablet: device.isTablet,
    isDesktop: device.isDesktop,
    isUltrawide: device.isUltrawide,
    isTouch: device.isTouch,
    effectiveFormFactor: device.effectiveFormFactor,
  };
}
