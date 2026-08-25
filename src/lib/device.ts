import { DeviceInfo, DeviceFormFactor, DeviceOS, DevicePointerType, DeviceOrientation, DeviceViewOverride } from "../types";

// Persistent key for manual device view override if user wants to test layouts
const DEVICE_OVERRIDE_KEY = "lifeorbit_device_view_override";

export function getSavedDeviceOverride(): DeviceViewOverride {
  try {
    const saved = localStorage.getItem(DEVICE_OVERRIDE_KEY);
    if (saved && ["auto", "mobile", "tablet", "desktop", "ultrawide"].includes(saved)) {
      return saved as DeviceViewOverride;
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  return "auto";
}

export function saveDeviceOverride(override: DeviceViewOverride) {
  try {
    localStorage.setItem(DEVICE_OVERRIDE_KEY, override);
  } catch (e) {
    // Ignore
  }
}

/**
 * Detects current device environment, operating system, input pointer modality,
 * viewport dimensions, and capabilities.
 */
export function detectDevice(override: DeviceViewOverride = "auto"): DeviceInfo {
  if (typeof window === "undefined") {
    // SSR / Default fallback
    return {
      formFactor: "desktop",
      effectiveFormFactor: "desktop",
      os: "unknown",
      osName: "Web Engine",
      browser: "other",
      browserName: "Browser",
      pointer: "mouse",
      isTouch: false,
      isHoverSupported: true,
      orientation: "landscape",
      isStandalone: false,
      hasNotch: false,
      screenWidth: 1280,
      screenHeight: 800,
      dpr: 1,
      isSmallPhone: false,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isUltrawide: false,
      deviceLabel: "Desktop Workspace",
      deviceEmoji: "💻",
      prefersReducedMotion: false,
      prefersDark: true,
      supportsHaptics: false,
      supportsWebShare: false,
      viewOverride: "auto",
    };
  }

  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;

  // 1. Operating System Detection
  let os: DeviceOS = "unknown";
  let osName = "Unknown OS";

  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (platform === "MacIntel" && maxTouchPoints > 1); // iPadOS 13+ detection
  const isAndroid = /Android/i.test(ua);
  const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(platform) && !isIOS;
  const isWindows = /Win32|Win64|Windows|WinCE/.test(platform);
  const isLinux = /Linux/.test(platform) && !isAndroid;
  const isChromeOS = /CrOS/.test(ua);

  if (isIOS) {
    if (/iPad/.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1)) {
      os = "ipados";
      osName = "Apple iPadOS";
    } else {
      os = "ios";
      osName = "Apple iOS";
    }
  } else if (isAndroid) {
    os = "android";
    osName = "Android OS";
  } else if (isMac) {
    os = "macos";
    osName = "Apple macOS";
  } else if (isWindows) {
    os = "windows";
    osName = "Microsoft Windows";
  } else if (isChromeOS) {
    os = "chromeos";
    osName = "Google ChromeOS";
  } else if (isLinux) {
    os = "linux";
    osName = "Linux";
  }

  // 2. Browser Detection
  let browser: "safari" | "chrome" | "firefox" | "edge" | "other" = "other";
  let browserName = "Browser";

  if (/Edg\//i.test(ua)) {
    browser = "edge";
    browserName = "Microsoft Edge";
  } else if (/Chrome|CriOS/i.test(ua) && !/Edg\//i.test(ua)) {
    browser = "chrome";
    browserName = "Google Chrome";
  } else if (/Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua)) {
    browser = "safari";
    browserName = "Apple Safari";
  } else if (/Firefox|FxiOS/i.test(ua)) {
    browser = "firefox";
    browserName = "Mozilla Firefox";
  }

  // 3. Pointer & Touch Modality
  const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const hasHover = window.matchMedia("(hover: hover)").matches;
  const isTouch = maxTouchPoints > 0 || hasCoarsePointer;

  let pointer: DevicePointerType = "mouse";
  if (isTouch && !hasHover) {
    pointer = "touch";
  } else if (isTouch && hasHover) {
    pointer = "hybrid";
  } else {
    pointer = "mouse";
  }

  // 4. Orientation
  const orientation: DeviceOrientation =
    width < height ? "portrait" : "landscape";

  // 5. Standalone / PWA / Home Screen
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true;

  // 6. Notch / Dynamic Island / Safe Area check
  // Common notch devices or safe-area inset top > 20px
  const hasNotch =
    isIOS &&
    (window.screen.height >= 812 || window.screen.width >= 812);

  // 7. Form Factor by physical / layout width
  let formFactor: DeviceFormFactor = "desktop";
  if (width < 640 || (isTouch && width < 768 && (isIOS || isAndroid) && os !== "ipados")) {
    formFactor = "mobile";
  } else if (width >= 640 && width < 1024) {
    formFactor = "tablet";
  } else if (width >= 1800) {
    formFactor = "ultrawide";
  } else {
    formFactor = "desktop";
  }

  // Handle effective form factor (if user sets an override)
  const effectiveFormFactor: DeviceFormFactor =
    override !== "auto" ? override : formFactor;

  const isSmallPhone = width < 380;
  const isMobile = effectiveFormFactor === "mobile";
  const isTablet = effectiveFormFactor === "tablet";
  const isDesktop = effectiveFormFactor === "desktop";
  const isUltrawide = effectiveFormFactor === "ultrawide";

  // 8. Device Label & Emoji
  let deviceLabel = "Desktop Cockpit";
  let deviceEmoji = "💻";

  if (isMobile) {
    if (os === "ios") {
      deviceLabel = "Apple iPhone (iOS)";
      deviceEmoji = "📱";
    } else if (os === "android") {
      deviceLabel = "Android Phone";
      deviceEmoji = "🤖";
    } else {
      deviceLabel = "Mobile Device";
      deviceEmoji = "📱";
    }
  } else if (isTablet) {
    if (os === "ipados" || os === "ios") {
      deviceLabel = "Apple iPad (iPadOS)";
      deviceEmoji = "📟";
    } else if (os === "android") {
      deviceLabel = "Android Tablet";
      deviceEmoji = "📟";
    } else {
      deviceLabel = "Tablet Touch Screen";
      deviceEmoji = "📟";
    }
  } else if (isUltrawide) {
    deviceLabel = "Ultrawide Command Center";
    deviceEmoji = "🖥️";
  } else {
    if (os === "macos") {
      deviceLabel = "MacBook / iMac (macOS)";
      deviceEmoji = "💻";
    } else if (os === "windows") {
      deviceLabel = "Windows Workstation";
      deviceEmoji = "🖥️";
    } else if (os === "linux") {
      deviceLabel = "Linux Machine";
      deviceEmoji = "🐧";
    } else {
      deviceLabel = "Desktop Browser";
      deviceEmoji = "💻";
    }
  }

  // 9. Accessibility preferences
  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const prefersDark =
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  // 10. Capabilities
  const supportsHaptics = typeof navigator !== "undefined" && "vibrate" in navigator;
  const supportsWebShare = typeof navigator !== "undefined" && "share" in navigator;

  return {
    formFactor,
    effectiveFormFactor,
    os,
    osName,
    browser,
    browserName,
    pointer,
    isTouch,
    isHoverSupported: hasHover,
    orientation,
    isStandalone,
    hasNotch,
    screenWidth: width,
    screenHeight: height,
    dpr,
    isSmallPhone,
    isMobile,
    isTablet,
    isDesktop,
    isUltrawide,
    deviceLabel,
    deviceEmoji,
    prefersReducedMotion,
    prefersDark,
    supportsHaptics,
    supportsWebShare,
    viewOverride: override,
  };
}

/**
 * Haptic Vibration Engine with safe degradation
 */
export type HapticType =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error"
  | "combo"
  | "levelUp";

export function triggerHaptic(type: HapticType = "light") {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) {
    return;
  }

  try {
    switch (type) {
      case "selection":
      case "light":
        navigator.vibrate(8);
        break;
      case "medium":
        navigator.vibrate(20);
        break;
      case "heavy":
        navigator.vibrate(40);
        break;
      case "success":
        navigator.vibrate([15, 40, 25]);
        break;
      case "warning":
        navigator.vibrate([30, 50, 30]);
        break;
      case "error":
        navigator.vibrate([50, 40, 50, 40, 50]);
        break;
      case "combo":
        navigator.vibrate([10, 20, 15, 30, 20]);
        break;
      case "levelUp":
        navigator.vibrate([25, 40, 35, 50, 60]);
        break;
      default:
        navigator.vibrate(10);
    }
  } catch (e) {
    // Vibration blocked or not permitted
  }
}
