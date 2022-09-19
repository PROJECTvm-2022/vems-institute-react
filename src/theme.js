import { createMuiTheme } from '@material-ui/core/styles';

const createTheme = (primary = '#118ab2') => {
    // Create a theme instance.
    let theme = createMuiTheme({
        palette: {
            type: 'light',
            common: {
                black: '#000',
                white: '#fff',
                gray: '#DADADA',
            },
            primary: {
                main: primary,
                secondary: 'rgb(90,62,167)',
            },
            secondary: {
                main: '#EA4335',
            },
            text: {
                primary: '#000000',
                disabled: 'rgba(0, 0, 0, 0.38)',
                hint: 'rgba(0, 0, 0, 0.38)',
                other: '#757575',
            },
            other: {
                subTextColor: '#878787',
                backgroundMenuColor: '#e9f5ff',
                textField: '#eeeeee',
            },
            background: {
                paper: '#ffffff',
                default: '#ffffff',
                other: '#F3F3F3',
                drawer: 'rgba(3, 127, 251, 0.05)',
                common: '#FFF5F5',
                strike: '#C6C6C6',
                secondary: '#2F415E',
                text: '#9A9A9A',
                upload: '#EEF7FF',
                cropper: '#EEF7FF',
                zoom: '#111111',
            },
            divider: '#E6E7EF',
            divider2: 'rgba(0, 0, 0, 0.12)',
        },
        typography: {
            fontFamily: 'SFProDisplay',
            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 500,
            fontWeightBold: 700,
            h1: {
                fontWeight: 300,
                fontSize: '80px',
                lineHeight: 1.167,
                letterSpacing: '"0.01562em',
            },
            h2: {
                fontWeight: 500,
                fontSize: '44px',
                lineHeight: '42px',
                letterSpacing: '-0.00833em',
                '@media(max-width: 500px)': {
                    fontSize: '30px',
                },
            },
            h3: {
                fontWeight: 600,
                fontSize: '24px',
                lineHeight: '32px',
                letterSpacing: '0.5px',
            },
            h4: {
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '21.5px',
                letterSpacing: '0rem',
            },
            h5: {
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '19px',
                letterSpacing: 'normal',
            },
            h6: {
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '19px',
                letterSpacing: 'normal',
            },
            subtitle1: {
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '20px',
                letterSpacing: '0.5px',
            },
            subtitle2: {
                fontWeight: 300,
                fontSize: '14px',
                lineHeight: '16.71px',
                letterSpacing: '0.4px',
            },
            body1: {
                fontWeight: 600,
                fontSize: '1rem',
                lineHeight: 1.5,
                letterSpacing: '0.00938em',
            },
            body2: {
                fontWeight: 500,
                fontSize: '0.875rem',
                lineHeight: 1.43,
                letterSpacing: '0.01071em',
            },
            button: {
                fontWeight: 600,
                fontSize: '16px',
                // lineHeight: '19px',
                letterSpacing: '0.02857em',
                // textTransform: 'uppercase',
            },
        },
        shape: {
            borderRadius: 6,
        },
        props: {
            MuiTab: {
                disableRipple: true,
            },
        },
        mixins: {
            toolbar: {
                minHeight: 48,
            },
        },
    });

    theme = {
        ...theme,
        overrides: {
            MuiDrawer: {
                paperAnchorDockedLeft: {
                    borderRight: 'none',
                },
            },
            MuiButton: {
                root: {
                    padding: '6px 10px',
                },
                label: {
                    textTransform: 'none',
                },
                contained: {
                    boxShadow: 'none',
                    '&:active': {
                        boxShadow: 'none',
                    },
                },
            },
            MuiTabs: {
                root: {
                    marginLeft: theme.spacing(1),
                },
                indicator: {
                    height: 3,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    // backgroundColor: theme.palette.common.white,
                },
            },
            MuiTab: {
                root: {
                    textTransform: 'none',
                    // margin: '0 16px',
                    minWidth: 0,
                    padding: 0,
                    [theme.breakpoints.up('md')]: {
                        padding: 0,
                        minWidth: 0,
                    },
                },
            },
            MuiIconButton: {
                root: {
                    padding: theme.spacing(1),
                },
            },
            MuiTooltip: {
                tooltip: {
                    borderRadius: 6,
                    backgroundColor: theme.palette.primary.main,
                    // boxShadow: `0px 4px 4px rgba(234, 67, 53, 0.34)`,
                    fontSize: '13px',
                },
            },
            MuiDivider: {
                root: {
                    border: '1px solid #DDDDDD',
                    height: 0,
                },
            },
            MuiListItemText: {
                primary: {
                    fontWeight: theme.typography.fontWeightMedium,
                },
            },
            // MuiListItemIcon: {
            //     root: {
            //         color: 'inherit',
            //         marginRight: 0,
            //         '& svg': {
            //             fontSize: 20,
            //         },
            //     },
            // },
            MuiAvatar: {
                root: {
                    width: 32,
                    height: 32,
                },
            },
            // MuiListItem: {
            //     gutters: {
            //         paddingRight: '0px',
            //         paddingLeft: '0px',
            //     },
            // },
            MuiPaper: {
                elevation4: {
                    boxShadow:
                        '0px 2px 4px -1px rgb(0 0 0 / 0%), 0px 4px 5px 0px rgb(0 0 0 / 0%), 12px 0px 10px 0px rgb(0 0 0 / 10%)',
                },
            },
            MuiButtonGroup: {
                contained: {
                    boxShadow: 'none',
                },
                groupedContainedHorizontal: {
                    borderRight: 'none',
                },
            },
            MuiStepper: {
                root: {
                    padding: 0,
                },
            },
            // MuiTableCell: {
            //     root: {
            //         padding: 12,
            //     },
            // },
            MuiTableHead: {
                root: {
                    backgroundColor: '#f3f3f3',
                    borderRadius: '6px',
                },
            },
            MuiTableCell: {
                root: {
                    wordBreak: 'break-all',
                },
            },
            MuiTableContainer: {
                root: {
                    minWidth: '900px',
                },
            },
            // MuiDialog: {
            //     root: {
            //         backgroundColor: '#F2F5FD',
            //     },
            // },
        },
    };

    return theme;
};

export default createTheme;
