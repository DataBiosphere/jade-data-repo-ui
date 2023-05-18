import { Theme, ThemeOptions } from '@mui/material/styles';
import {
  CommonColors,
  Palette,
  PaletteColor,
  PaletteOptions,
} from '@mui/material/styles/createPalette';
import { Typography, TypographyOptions } from '@mui/material/styles/createTypography';
import { Overrides } from '@mui/styles/overrides';
import { CSSProperties, Mixins, MixinsOptions } from '@mui/material/styles/createMixins';

declare module '@mui/material/styles' {
  interface CustomCommonColors extends CommonColors {
    link?: string;
    linkHover?: string;
    selection: string;
    border?: string;
    selectedTextBackground?: string;
  }

  interface CustomPaletteColors extends PaletteColor {
    cellBackgroundHeader?: string;
    cellBackgroundDark?: string;
    callBackgroundLight?: string;
    borderColor?: string;
    paginationBlue?: string;
    background?: string;
    footer?: string;
    outsidePanel?: string;
    outsidePanelOpacity?: number;
    green?: string;
    darkGreen?: string;
    lightContrast?: string;
    hover?: string;
    focus?: string;
    bottomColor?: string;
  }

  interface CustomPaletteOptions extends PaletteOptions {
    common?: Partial<CustomCommonColors>;
    lightTable?: Partial<CustomPaletteColors>;
    panel?: Partial<CustomPaletteColors>;
    terra?: Partial<CustomPaletteColors>;
    primary?: Partial<CustomPaletteColors>;
  }

  interface CustomPalette extends Palette {
    common: CustomCommonColors;
    lightTable: CustomPaletteColors;
    panel: CustomPaletteColors;
    terra: CustomPaletteColors;
    primary: CustomPaletteColors;
  }

  interface CustomTypographyOptions extends TypographyOptions {
    color?: string;
    useNextVariants?: boolean;
    fontWeight?: string;
    bold?: string;
  }

  interface CustomTypography extends Typography {
    color: string;
    useNextVariants: boolean;
    fontWeight: string;
    bold: string;
  }

  interface CustomMixins extends Mixins {
    jadeLink: JadeLink;
    containerWidth: CSSProperties;
    pageRoot: CSSProperties;
    pageTitle: CSSProperties;
    ellipsis: CSSProperties;
  }

  interface JadeLink extends CSSProperties {
    '&:hover': CSSProperties;
  }

  interface CustomMixinsOptions extends MixinsOptions {
    jadeLink?: JadeLink;
    containerWidth?: CSSProperties;
    pageRoot?: CSSProperties;
    pageTitle?: CSSProperties;
    ellipsis?: CSSProperties;
  }

  interface CustomConstants {
    navBarHeight: string;
  }

  interface CustomConstantsOptions {
    navBarHeight?: string;
  }

  interface CustomTheme extends Theme {
    typography: CustomTypography;
    palette: CustomPalette;
    overrides: Overrides;
    mixins: CustomMixins;
    constants: CustomConstants;
  }

  // allow configuration using `createTheme`
  interface CustomThemeOptions extends ThemeOptions {
    typography?: CustomTypographyOptions;
    palette?: CustomPaletteOptions;
    overrides?: Overrides;
    mixins?: CustomMixinsOptions;
    constants?: CustomConstantsOptions;
  }

  export function createTheme(options?: CustomThemeOptions): CustomTheme;
}
