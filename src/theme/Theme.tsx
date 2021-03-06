import { createGlobalStyle } from 'styled-components';
import { blue } from '@material-ui/core/colors';
import responsiveFontSizes from '@material-ui/core/styles/responsiveFontSizes';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const COLOR1 = '#0D0D0D'; // dark gray
const COLOR2 = '#6ec6d8'; // bluish
const COLOR3 = '#03FCF5'; // bright bluish- Tetra

const PRIMARY_TEXT = '#dbdbdb';
const SECONDARY_TEXT = '#7B7B7B';

export const baseTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: COLOR1,
      },
      secondary: {
        main: COLOR3,
      },
      text: {
        // primary: PRIMARY_TEXT,
        // secondary: SECONDARY_TEXT,
      },
      background: {
        // DEV_NOTE : This sets the app background color
        default: '#000000',
      },
    },
    typography: {
      fontFamily: 'Montserrat',
    },
    overrides: {
      MuiPaper: {
        root: {
          backgroundColor: COLOR1,
        },
      },
      MuiTypography: {
        colorPrimary: {
          color: PRIMARY_TEXT,
        },
      },
      MuiLink: {
        root: {
          color: blue[500],
        },
      },
    },
  }),
);

export const AppStyles = {};

/**
 * DEV_NOTE : This, together with the 'responsiveFontSizes' ensures responsiveness in the Typography and 'em/rem' sizes.
 */
export const GlobalStyleComponent = createGlobalStyle`
  body {
    @media (min-width: 1920px) {
      font-size: 20px;
    }

    @media (max-width: 1920px) {
      font-size: 18px;
    }

    @media (max-width: 1600px) {
      font-size: 16px;
    }

    @media (max-width: 1366px) {
      font-size: 14px;
    }

    @media (max-width: 1200px) {
      font-size: 12px;
    }

    @media (max-width: 1024px) {
      font-size: 10px;
    }

    @media (max-width: 768px) {
      font-size: 8px;
    }
  }
`;
