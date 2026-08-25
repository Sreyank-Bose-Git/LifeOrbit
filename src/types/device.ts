export type DeviceFormFactor = "mobile" | "tablet" | "desktop" | "ultrawide";
export type DeviceOS = "ios" | "android" | "macos" | "windows" | "linux" | "ipados" | "chromeos" | "unknown";
export type DevicePointerType = "touch" | "mouse" | "hybrid";
export type DeviceOrientation = "portrait" | "landscape";
export type DeviceViewOverride = "auto" | "mobile" | "tablet" | "desktop" | "ultrawide";

export interface DeviceInfo {
  formFactor: DeviceFormFactor;
  effectiveFormFactor: DeviceFormFactor; // takes user override into account
  os: DeviceOS;
  osName: string;
  browser: "safari" | "chrome" | "firefox" | "edge" | "other";
  browserName: string;
  pointer: DevicePointerType;
  isTouch: boolean;
  isHoverSupported: boolean;
  orientation: DeviceOrientation;
  isStandalone: boolean; // PWA or installed home screen
  hasNotch: boolean;
  screenWidth: number;
  screenHeight: number;
  dpr: number;
  isSmallPhone: boolean; // < 400px width
  isMobile: boolean; // phone (< 640px or effective mobile)
  isTablet: boolean; // 640px to 1024px
  isDesktop: boolean; // >= 1024px
  isUltrawide: boolean; // >= 1800px
  deviceLabel: string; // e.g. "Apple iPhone (iOS)", "Samsung Galaxy (Android)", "MacBook Pro (macOS)"
  deviceEmoji: string; // e.g. "📱", "🤖", "📟", "💻", "🖥️"
  prefersReducedMotion: boolean;
  prefersDark: boolean;
  supportsHaptics: boolean;
  supportsWebShare: boolean;
  viewOverride: DeviceViewOverride;
}
