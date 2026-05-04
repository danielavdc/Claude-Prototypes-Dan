/**
 * Palette Variants for Accessibility
 *
 * This file contains 4 color palette variants (light mode only):
 * 1. Light (default)
 * 2. Light Protanopia (red-blind)
 * 3. Light Deuteranopia (green-blind)
 * 4. Light Tritanopia (blue-blind)
 */

// ==========================================
// LIGHT MODE (Default)
// ==========================================

export const lightPalette = {
  mode: 'light',
  brand: {
    primary: '#00827F',        // Teal
    primaryLight: '#E0F1F2',
    primaryDark: '#00726E',
    secondary: '#B627A1',      // Purple
    secondaryLight: '#F7E6F3',
    secondaryDark: '#971B94',
  },
  status: {
    success: '#4caf50',
    successLight: '#e8f5e9',
    successDark: '#2e7d32',
    warning: '#fb8c00',
    warningLight: '#fff3e0',
    warningDark: '#e65100',
    error: '#f44336',
    errorLight: '#ffebee',
    errorDark: '#c62828',
    info: '#2196f3',
    infoLight: '#e3f2fd',
    infoDark: '#1565c0',
  },
  text: {
    primary: '#212121',
    secondary: '#616161',
    light: '#757575',
    disabled: 'rgba(0, 0, 0, 0.38)',
    white: '#fff',
  },
  background: {
    default: '#f5f5f5',
    paper: '#fff',
  },
  divider: 'rgba(33, 33, 33, 0.12)',
  action: {
    active: 'rgba(0, 0, 0, 0.54)',
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    focus: 'rgba(0, 0, 0, 0.12)',
  },
};

// ==========================================
// PROTANOPIA (Red-blind) - Light Mode
// ==========================================

export const lightProtanopiaPalette = {
  mode: 'light',
  brand: {
    primary: '#1D9F9F',
    primaryLight: '#E0F1F2',
    primaryDark: '#00726E',
    secondary: '#B627A1',
    secondaryLight: '#F7E6F3',
    secondaryDark: '#971B94',
  },
  status: {
    success: '#0288D1',
    successLight: '#E1F5FE',
    successDark: '#01579B',
    warning: '#EF6C00',
    warningLight: '#FFF3E0',
    warningDark: '#E65100',
    error: '#F57C00',
    errorLight: '#FFF3E0',
    errorDark: '#EF6C00',
    info: '#5E35B1',
    infoLight: '#EDE7F6',
    infoDark: '#4527A0',
  },
  text: {
    primary: '#212121',
    secondary: '#616161',
    light: '#757575',
    disabled: 'rgba(0, 0, 0, 0.38)',
    white: '#fff',
  },
  background: {
    default: '#f5f5f5',
    paper: '#fff',
  },
  divider: 'rgba(33, 33, 33, 0.12)',
  action: {
    active: 'rgba(0, 0, 0, 0.54)',
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    focus: 'rgba(0, 0, 0, 0.12)',
  },
};

// ==========================================
// DEUTERANOPIA (Green-blind) - Light Mode
// ==========================================

export const lightDeuteranopiaPalette = {
  mode: 'light',
  brand: {
    primary: '#1D9F9F',
    primaryLight: '#E0F1F2',
    primaryDark: '#00726E',
    secondary: '#B627A1',
    secondaryLight: '#F7E6F3',
    secondaryDark: '#971B94',
  },
  status: {
    success: '#0288D1',
    successLight: '#E1F5FE',
    successDark: '#01579B',
    warning: '#EF6C00',
    warningLight: '#FFF3E0',
    warningDark: '#E65100',
    error: '#F57C00',
    errorLight: '#FFF3E0',
    errorDark: '#EF6C00',
    info: '#5E35B1',
    infoLight: '#EDE7F6',
    infoDark: '#4527A0',
  },
  text: {
    primary: '#212121',
    secondary: '#616161',
    light: '#757575',
    disabled: 'rgba(0, 0, 0, 0.38)',
    white: '#fff',
  },
  background: {
    default: '#f5f5f5',
    paper: '#fff',
  },
  divider: 'rgba(33, 33, 33, 0.12)',
  action: {
    active: 'rgba(0, 0, 0, 0.54)',
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    focus: 'rgba(0, 0, 0, 0.12)',
  },
};

// ==========================================
// TRITANOPIA (Blue-blind) - Light Mode
// ==========================================

export const lightTritanopiaPalette = {
  mode: 'light',
  brand: {
    primary: '#D81B60',
    primaryLight: '#FCE4EC',
    primaryDark: '#AD1457',
    secondary: '#6A1B9A',
    secondaryLight: '#F3E5F5',
    secondaryDark: '#4A148C',
  },
  status: {
    success: '#388E3C',
    successLight: '#E8F5E9',
    successDark: '#2E7D32',
    warning: '#D84315',
    warningLight: '#FBE9E7',
    warningDark: '#BF360C',
    error: '#C62828',
    errorLight: '#FFEBEE',
    errorDark: '#B71C1C',
    info: '#C2185B',
    infoLight: '#FCE4EC',
    infoDark: '#880E4F',
  },
  text: {
    primary: '#212121',
    secondary: '#616161',
    light: '#757575',
    disabled: 'rgba(0, 0, 0, 0.38)',
    white: '#fff',
  },
  background: {
    default: '#f5f5f5',
    paper: '#fff',
  },
  divider: 'rgba(33, 33, 33, 0.12)',
  action: {
    active: 'rgba(0, 0, 0, 0.54)',
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    focus: 'rgba(0, 0, 0, 0.12)',
  },
};

// ==========================================
// PALETTE MAP
// ==========================================

export const palettes = {
  light: lightPalette,
  protanopia: lightProtanopiaPalette,
  deuteranopia: lightDeuteranopiaPalette,
  tritanopia: lightTritanopiaPalette,
};

export const getPalette = (colorblindType = 'none') => {
  if (!colorblindType || colorblindType === 'none') {
    return palettes.light;
  }
  return palettes[colorblindType] || palettes.light;
};
