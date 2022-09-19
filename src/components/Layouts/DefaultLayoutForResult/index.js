import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import { useRouter } from 'next/router';
import Logo from '../../../assets/img/vemsLogo.jpg';
import Footer from './Footer';

const drawerWidth = 240;
const appbarHeight = 55;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        background: theme.palette.common.white,
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
        color: theme.palette.background.secondary,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxShadow: '3px 9px 20px 0px rgba(0, 0, 0, 0.1)',
        height: '100vh',
    },
    drawerOpen: {
        width: drawerWidth,
        paddingLeft: theme.spacing(1.2),
        paddingRight: theme.spacing(0.8),
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(0.5),
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(9) + 1,
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        height: appbarHeight,
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    listIconImage: {
        margin: theme.spacing(0.5),
    },
    listIconImage1: {
        margin: theme.spacing(0.5),
        height: 15,
        width: 15,
    },
    image: {
        height: 30,
        width: 'auto',
    },
    image2: {
        height: 30,
        width: 'auto',
    },
}));

const DefaultLayout = ({ children }) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const handleDrawer = () => {
        setOpen(!open);
    };

    const [mobOpen, setMobOpen] = React.useState(false);

    const handleMobDrawer = () => {
        setMobOpen(!mobOpen);
    };

    //change menuLocation to see change
    const menuLocation = 'appbar';

    useEffect(() => {
        if (window.innerWidth <= 800) {
            setOpen(false);
        } else if (menuLocation !== 'appbar') {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, []);

    const Router = useRouter();

    const toDashBoard = () => {
        Router.push('/');
    };

    return (
        <React.Fragment>
            <div className={classes.root}>
                <AppBar
                    className={clsx(classes.appBar, {
                        // [classes.appBarShift]: open,
                    })}
                    position="fixed"
                >
                    <Toolbar>
                        <Hidden xsDown>
                            <img
                                alt={'Logo'}
                                className={classes.image}
                                onClick={toDashBoard}
                                src={Logo}
                                style={{ cursor: 'pointer' }}
                            />
                        </Hidden>
                        <Hidden smUp>
                            <img
                                alt={'Logo'}
                                className={classes.image}
                                onClick={toDashBoard}
                                src={Logo}
                                style={{ cursor: 'pointer' }}
                            />
                        </Hidden>
                    </Toolbar>
                </AppBar>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {children}
                </main>
            </div>
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    width: '100vw',
                }}
            >
                <Footer />
            </div>
        </React.Fragment>
    );
};

DefaultLayout.propTypes = {
    children: PropTypes.node,
};

export default DefaultLayout;
