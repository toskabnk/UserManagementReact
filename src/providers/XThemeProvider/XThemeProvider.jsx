import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material';

import useBool from '@ximdex/xui-react/hooks/useBool';

import XThemeContext from './XThemeContext';

const XThemeProvider = ({ children }) => {
    const theme = createTheme(
        {
            palette: {
                mode: 'light',
                primary: {
                    main: '#43a1a2',
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: '#214F61',
                    contrastText: '#ffffff',
                },
                background: {
                    100: '#ffffff',  // same as paper
                    200: '#f5f5f5',
                    300: '#eeeeee',  // same as primary
                    400: '#eaeaea',
                    500: '#e0e0e0',  // same as secondary
                    600: '#adadad',  // same as tertiary
                    700: '#686868',
                    primary: '#eee',
                    secondary: '#e0e0e0',
                    tertiary: '#adadad',
                    paper: "#ffffff",
                },
                status: {
                    error: '#e13144',
                    warning: '#f6ab0e',
                    success: '#4ba0a0',
                    info: '#5c9ad0',
                    correct: {
                        100: '#e9f5ed',
                        200: '#95cda9'
                    },
                    incorrect: {
                        100: '#f5e9ed',
                        200: '#cd95a9'
                    }
                },
                font: {
                    primary: '#222',
                }
            },
            size: {
                em: {
                    xxs: '0.4em',
                    xs: '0.6em',
                    s: '0.8em',
                    m: '1em',
                    l: '1.25em',
                    xl: '1.5em',
                    xxl: '2em',
                    unset: 'unset'
                },
                px: {
                    xxs: '6px',
                    xs: '9px',
                    s: '12px',
                    m: '16px',
                    l: '20px',
                    xl: '24px',
                    xxl: '32px',
                    unset: 'unset'
                },
                navbar: {
                    s: '55px',
                    m: '82px',
                    unset: 'unset',
                },
            },
            properties: {
                padding: {
                    xs: '4px',
                    s: '8px',
                    m: '16px',
                    l: '32px',
                    unset: 'unset',
                },
                paddingX: {
                    s: '0px 8px',
                    m: '0px 16px',
                    l: '0px 32px',
                    unset: 'unset',
                },
                paddingY: {
                    s: '8px 0px',
                    m: '16px 0px',
                    l: '32px 0px',
                    unset: 'unset',
                },
                radius: {
                    m: '8px',
                },
                weight: {
                    xs: '200',
                    s: '300',
                    m: '400',
                    l: '500',
                    xl: '600',
                    xxl: '800'
                },
                border: {
                    m: '1px solid #adadad',
                    l: '4px solid #adadad',
                    status: {
                        active: '4px solid #43A1A2',
                        inactive: '4px solid #adadad',
                    }
                }
            }
        }
    )

    const [darkMode, setDarkMode, toggleDarkMode] = useBool(false);

    // let customerTheme = darkMode === true ? themes[CLIENTS.DEFAULT].dark : themes[CLIENTS.DEFAULT].light;

    // const theme = createTheme(customerTheme);
    // document.body.style.background = theme.palette.background.default;

    return (
        <XThemeContext.Provider
            value={{
                darkMode,
                setDarkMode,
                toggleDarkMode,
                theme
            }}
        >
            <ThemeProvider theme={theme} >
                {children}
            </ThemeProvider>
        </XThemeContext.Provider>
    )
};

export default XThemeProvider;