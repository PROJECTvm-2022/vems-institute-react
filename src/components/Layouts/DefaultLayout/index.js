import React, { useEffect } from 'react';
import TopHeader from './TopHeader';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import MenuList from './MenuList';
import CloseIcon from '@material-ui/icons/Close';
import Hidden from '@material-ui/core/Hidden';
import { useRouter } from 'next/router';
import WatchIcon from '@material-ui/icons/AccessTime';
import AssessmentIcon from '@material-ui/icons/Assessment';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import ListAltIcon from '@material-ui/icons/ListAlt';
import DropDownMenuList from './DropDownMenuList';
import MenuIcon from '../../../assets/MenuIcon.svg';
import { useUser } from '../../../store/UserContext';
import { CheckUser } from '../../../utils/CheckPermit';
import DashboardIcon from '../../../assets/img/menu-icons/dashboard unselected.svg';
import DashboardSelectedIcon from '../../../assets/img/menu-icons/Dashboard selected.svg';
import StudentsIcon from '../../../assets/img/menu-icons/Students unselected.svg';
import StudentsSelectedIcon from '../../../assets/img/menu-icons/Students selected.svg';
import VideoIcon from '../../../assets/img/menu-icons/video lectures unselected.svg';
import VideoSelectedIcon from '../../../assets/img/menu-icons/video lectures selected.svg';
import ParentsIcon from '../../../assets/img/menu-icons/Parents unselected.svg';
import ParentsSelectedIcon from '../../../assets/img/menu-icons/Parents selected.svg';
import Logo from '../../../assets/img/vemsLogo.jpg';
import MenuBookIcon from '../../../assets/img/menu-icons/ClassIcon.svg';
import AttendanceSelected from '../../../assets/img/menu-icons/Attendance selected.svg';
import AttendanceUnSelected from '../../../assets/img/menu-icons/Attendance unselected.svg';
import MenuBookIcons from '@material-ui/icons/MenuBook';
import SubjectUnSelected from '../../../assets/BasicDetailsVector.svg';
import LiveClassImage from '../../../assets/live classes selected.svg';
import LiveClassImageUnselected from '../../../assets/live classes unselected.svg';
import AllExamImageselected from '../../../assets/All exams selected.svg';
import AllExamsImageUnselected from '../../../assets/All exams unselected.svg';
import Footer from "./Footer";

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

    const [user] = useUser();

    const userAccess = CheckUser(user);
    const userAccessStrict = CheckUser(user, true);

    const categories = [
        userAccess.ADMIN && {
            id: 'Dashboard',
            children: [
                {
                    id: 'Dashboard',
                    icon: <img alt={'dashboard'} className={classes.listIconImage} src={DashboardIcon} />,
                    selectedIcon: (
                        <img alt={'dashboard'} className={classes.listIconImage} src={DashboardSelectedIcon} />
                    ),
                    active: Router.pathname === '/',
                    href: '/',
                },
            ],
        },
        userAccessStrict.TEACHER && {
            id: 'Dashboard',
            children: [
                {
                    id: 'Dashboard',
                    icon: <img alt={'dashboard'} className={classes.listIconImage} src={DashboardIcon} />,
                    selectedIcon: (
                        <img alt={'dashboard'} className={classes.listIconImage} src={DashboardSelectedIcon} />
                    ),
                    active: Router.pathname === '/teacher-dashboard',
                    href: '/teacher-dashboard',
                },
            ],
        },
        userAccessStrict.STUDENT && {
            id: 'Dashboard',
            children: [
                {
                    id: 'Dashboard',
                    icon: <img alt={'dashboard'} className={classes.listIconImage} src={DashboardIcon} />,
                    selectedIcon: (
                        <img alt={'dashboard'} className={classes.listIconImage} src={DashboardSelectedIcon} />
                    ),
                    active: Router.pathname === '/student-dashboard',
                    href: '/student-dashboard',
                },
            ],
        },
        userAccess.ADMIN && {
            id: 'Exams',
            children: [
                // {
                //     id: 'Students',
                //     icon: <img alt={'Students'} className={classes.listIconImage} src={StudentsIcon} />,
                //     selectedIcon: <img alt={'Students'} className={classes.listIconImage} src={StudentsSelectedIcon} />,
                //     active: Router.pathname === '/students',
                //     href: '/students',
                // },
                // {
                //     id: 'Student Request',
                //     icon: <img alt={'Students'} className={classes.listIconImage} src={AttendanceUnSelected} />,
                //     selectedIcon: <img alt={'Students'} className={classes.listIconImage} src={AttendanceSelected} />,
                //     active: Router.pathname === '/students/unapproved',
                //     href: '/students/unapproved',
                // },
                // {
                //     id: 'Batches',
                //     icon: <img alt={'Batches'} className={classes.listIconImage} src={ParentsIcon} />,
                //     selectedIcon: <img alt={'Batches'} className={classes.listIconImage} src={ParentsSelectedIcon} />,
                //     active: Router.pathname === '/institute/batch',
                //     href: '/institute/batch',
                // },
                // {
                //     id: 'Courses',
                //     icon: <img alt={'Batches'} className={classes.listIconImage1} src={SubjectUnSelected} />,
                //     selectedIcon: <img alt={'Batches'} className={classes.listIconImage1} src={MenuBookIcon} />,
                //     active: Router.pathname === '/institute-courses',
                //     href: '/institute-courses',
                // },
                {
                    id: 'All Exams',
                    icon: <img alt={'Batches'} className={classes.listIconImage1} src={AllExamsImageUnselected} />,
                    selectedIcon: <img alt={'Batches'} className={classes.listIconImage1} src={AllExamImageselected} />,
                    active: Router.pathname === '/exams',
                    href: '/exams',
                },
                // {
                //     id: 'All LiveClass',
                //     icon: <img alt={'Batches'} className={classes.listIconImage1} src={LiveClassImageUnselected} />,
                //     selectedIcon: <img alt={'Batches'} className={classes.listIconImage1} src={LiveClassImage} />,
                //     active: Router.pathname === '/all-live-class',
                //     href: '/all-live-class',
                // },
                // {
                //     id: 'All Assignments',
                //     icon: (
                //         <img
                //             alt={'all-assignments'}
                //             className={classes.listIconImage1}
                //             src={LiveClassImageUnselected}
                //         />
                //     ),
                //     selectedIcon: (
                //         <img alt={'all-assignments'} className={classes.listIconImage1} src={LiveClassImage} />
                //     ),
                //     active: Router.pathname === '/all-assignments',
                //     href: '/all-assignments',
                // },
            ],
        },
        userAccessStrict.STUDENT && {
            id: 'Academic',
            children: [
                {
                    id: 'Video lectures',
                    icon: <img alt={'Video lectures'} className={classes.listIconImage} src={VideoIcon} />,
                    selectedIcon: (
                        <img alt={'Video lectures'} className={classes.listIconImage} src={VideoSelectedIcon} />
                    ),
                    active: Router.pathname === '/video-lecture',
                    href: '/video-lecture',
                },
            ].filter(Boolean),
        },
        userAccessStrict.TEACHER && {
            id: 'Academic',
            children: [
                {
                    id: 'My Subjects',
                    icon: <ListAltIcon color="inherit" />,
                    active: Router.pathname === '/teacher-subject',
                    href: '/teacher-subject',
                },
                {
                    id: 'Materials',
                    icon: <MenuBookIcons color="inherit" />,
                    active: Router.pathname === '/materials',
                    href: '/materials',
                },
                {
                    id: 'My Time Table',
                    icon: <CalendarTodayIcon color="inherit" />,
                    active: Router.pathname === '/teacher-slot',
                    href: '/teacher-slot',
                },
                {
                    id: 'Scheduled Classes',
                    icon: <WatchIcon color="inherit" />,
                    active: Router.pathname === '/teacher-attendance',
                    href: '/teacher-attendance',
                },
                {
                    id: 'All Exams',
                    icon: <AssessmentIcon color="inherit" />,
                    active: Router.pathname.startsWith('/exams') || Router.pathname.startsWith('/students-in-exam'),
                    href: '/exams',
                },
                {
                    id: 'All Assignments',
                    icon: (
                        <img
                            alt={'all-assignments'}
                            className={classes.listIconImage1}
                            src={LiveClassImageUnselected}
                        />
                    ),
                    selectedIcon: (
                        <img alt={'all-assignments'} className={classes.listIconImage1} src={LiveClassImage} />
                    ),
                    active: Router.pathname === '/all-assignments',
                    href: '/all-assignments',
                },
            ].filter(Boolean),
        },
        // userAccessStrict.ADMIN ||
        // (userAccessStrict.SUPER_ADMIN && {
        //     id: 'accounts',
        //     children: [
        //         {
        //             id: 'Transactions',
        //             icon: <FormatListNumberedIcon color="inherit" />,
        //             active: Router.pathname === '/all-transaction',
        //             href: '/all-transaction',
        //         },
        //     ].filter(Boolean),
        // }),
    ].filter(Boolean);

    const Menu = () => (
        <svg fill="none" height="17" viewBox="0 0 14 17" width="14" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.96606H13" stroke="#003760" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path
                d="M1 6.46606H6.81818"
                stroke="#EA4335"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path d="M1 10.9661H13" stroke="#003760" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path
                d="M1 15.4661H6.81818"
                stroke="#EA4335"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );

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
                            <IconButton
                                className={clsx(classes.menuButton, {
                                    // [classes.hide]: open || menuLocation !== 'appbar',
                                })}
                                edge="start"
                                onClick={handleDrawer}
                            >
                                <img alt={'Menu Icon'} src={MenuIcon} />
                            </IconButton>
                            <img
                                alt={'Logo'}
                                className={classes.image}
                                onClick={toDashBoard}
                                src={Logo}
                                style={{ cursor: 'pointer' }}
                            />
                        </Hidden>
                        <Hidden smUp>
                            <IconButton
                                className={clsx(classes.menuButton, {
                                    [classes.hide]: menuLocation !== 'appbar',
                                })}
                                edge="start"
                                onClick={handleMobDrawer}
                            >
                                <img alt={'Menu Icon'} src={MenuIcon} />
                            </IconButton>
                            <img
                                alt={'Logo'}
                                className={classes.image}
                                onClick={toDashBoard}
                                src={Logo}
                                style={{ cursor: 'pointer' }}
                            />
                        </Hidden>
                        {menuLocation !== 'appbar' ? <DropDownMenuList categories={categories} /> : ''}
                        <TopHeader />
                    </Toolbar>
                </AppBar>
                <Hidden xsDown>
                    <Drawer
                        className={clsx(classes.drawer, {
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                            [classes.hide]: menuLocation !== 'appbar',
                        })}
                        classes={{
                            paper: clsx({
                                [classes.drawerOpen]: open,
                                [classes.drawerClose]: !open,
                                [classes.hide]: menuLocation !== 'appbar',
                            }),
                        }}
                        variant="permanent"
                    >
                        <div className={classes.toolbar}>
                            <IconButton className={classes.menuButton} onClick={handleDrawer}>
                                {/*<img alt={'Menu Icon'} src={MenuIcon} />*/}
                                <Menu />
                            </IconButton>
                        </div>
                        {/*{open ? <Box mt={2} /> : <Box mt={3} />}*/}
                        <Box mt={2} />
                        <MenuList categories={categories} open={open} />
                    </Drawer>
                </Hidden>
                <Hidden smUp>
                    <Drawer onClose={handleMobDrawer} open={mobOpen}>
                        <Box display={'flex'} justifyContent={'space-around'}>
                            <Box alignSelf={'center'} dispaly={'flex'}>
                                <Typography>{'Logo'}</Typography>
                            </Box>
                            <IconButton onClick={handleMobDrawer}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box p={1.5}>
                            <MenuList categories={categories} open={true} />
                        </Box>
                    </Drawer>
                </Hidden>
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
