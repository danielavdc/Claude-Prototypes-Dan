import { createTheme } from '@mui/material/styles';
import { getPalette } from './palette-variants';

/**
 * Calculate relative luminance of a hex color
 * Used to determine optimal contrast text color
 * Based on WCAG 2.0 formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html
 */
const getLuminance = (hexColor) => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Apply gamma correction
  const [rs, gs, bs] = [r, g, b].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );

  // Calculate luminance
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Get optimal contrast text color (black or white) for a given background color
 * Returns white for dark colors, black for light colors
 */
const getContrastText = (bgColor) => {
  const luminance = getLuminance(bgColor);
  // WCAG recommends 0.179 as the threshold for contrast
  return luminance > 0.179 ? '#000000' : '#ffffff';
};

/**
 * Creates a dynamic MUI theme based on selected colorblind type
 *
 * @param {string} colorblindType - 'none', 'protanopia', 'deuteranopia', or 'tritanopia'
 * @returns {Theme} MUI theme object
 */
export const createDynamicTheme = (colorblindType = 'none') => {
  const palette = getPalette(colorblindType);

  return createTheme({
    spacing: 8,
    palette: {
      mode: 'light',
      primary: {
        light: palette.brand.primaryLight,
        main: palette.brand.primary,
        dark: palette.brand.primaryDark,
        contrastText: getContrastText(palette.brand.primary),
      },
      secondary: {
        light: palette.brand.secondaryLight,
        main: palette.brand.secondary,
        dark: palette.brand.secondaryDark,
        contrastText: getContrastText(palette.brand.secondary),
      },
      error: {
        light: palette.status.errorLight,
        main: palette.status.error,
        dark: palette.status.errorDark,
        contrastText: getContrastText(palette.status.error),
      },
      warning: {
        light: palette.status.warningLight,
        main: palette.status.warning,
        dark: palette.status.warningDark,
        contrastText: getContrastText(palette.status.warning),
      },
      info: {
        light: palette.status.infoLight,
        main: palette.status.info,
        dark: palette.status.infoDark,
        contrastText: getContrastText(palette.status.info),
      },
      success: {
        light: palette.status.successLight,
        main: palette.status.success,
        dark: palette.status.successDark,
        contrastText: getContrastText(palette.status.success),
      },
      grey: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
        A100: '#f5f5f5',
        A200: '#eeeeee',
        A400: '#bdbdbd',
        A700: '#616161',
      },
      background: {
        default: palette.background.default,
        paper: palette.background.paper,
      },
      text: {
        primary: palette.text.primary,
        secondary: palette.text.secondary,
        disabled: palette.text.disabled,
      },
      action: {
        active: palette.action.active,
        hover: palette.action.hover,
        selected: palette.action.selected,
        disabled: palette.action.disabled,
        disabledBackground: palette.action.disabledBackground,
        focus: palette.action.focus,
      },
      divider: palette.divider,
    },
    typography: {
      fontFamily: '"Helvetica Neue", Helvetica, Arial, Inter, "Segoe UI", sans-serif',
      h4: {
        fontSize: '32px',
        lineHeight: '40px',
        fontWeight: 700,
      },
      h5: {
        fontSize: '24px',
        lineHeight: '32px',
        fontWeight: 400,
      },
      h6: {
        fontSize: '20px',
        lineHeight: '26px',
        fontWeight: 600,
      },
      subtitle1: {
        fontSize: '16px',
        lineHeight: '22px',
        fontWeight: 400,
      },
      body1: {
        fontSize: '14px',
        lineHeight: '18px',
        fontWeight: 400,
      },
      body2: {
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: 400,
      },
      caption: {
        fontSize: '12px',
        lineHeight: '16px',
        fontWeight: 400,
      },
    },
    shape: {
      borderRadius: 4,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '4px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
            '&:active': {
              boxShadow: 'none',
            },
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
        defaultProps: {
          disableElevation: true,
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
      MuiSelect: {
        defaultProps: {
          variant: 'outlined',
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
          },
          rounded: {
            borderRadius: '4px',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '4px',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: palette.background.paper,
            color: palette.text.primary,
            borderRadius: 0,
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            borderRadius: 0,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          standardInfo: {
            backgroundColor: palette.status.infoLight,
            color: palette.status.infoDark,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: '#f5f5f5',
              '&:hover': {
                backgroundColor: '#eeeeee',
              },
            },
          },
        },
      },
    },
  });
};

export default createDynamicTheme;
