import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
// import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
// import SearchIcon from '@material-ui/icons/Search';
// import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
// import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import ProfileLogo from '../../../assets/Ellipse.svg';
import { useUser } from '../../../store/UserContext';
// import Menu from '@material-ui/core/Menu';
import { useLanguage } from '../../../store/LanguageStore';
import { authCookieName } from '../../../apis/rest.app';
import { useRouter } from 'next/router';
import Permit from '../../Permit';
import Link from '../../Link';
import { useConfirm } from '../../Confirm';
// import Divider from '@material-ui/core/Divider';
// import Typography from '@material-ui/core/Typography';
// import Translate from '../../Translate';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        height: '55px',
        padding: '5px',
        alignItems: 'center',
    },
    grow: {
        flexGrow: 1,
    },
    search: {
        display: 'flex',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.background.other, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.background.other, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
    },
    searchIcon: {
        backgroundColor: theme.palette.background.other,
        height: '100%',
        width: '30px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '0px 6px 6px 0px',
    },
    inputInput: {
        fontSize: '12px',
        padding: theme.spacing(1.3, 0, 1.4, 0),
        backgroundColor: theme.palette.background.other,
        paddingLeft: `calc(1em + ${theme.spacing(0.1)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '350px',
        },
        [theme.breakpoints.down('sm')]: {
            maxWidth: '230px',
        },
    },
    color: {
        backgroundColor: theme.palette.background.other,
    },
    menuList: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
    dropDown: {
        fontSize: '15px',
        paddingLeft: '15px',
        backgroundColor: theme.palette.background.other,
        '&:hover': {
            boxShadow: 'none',
        },
    },
    profile: {
        background: theme.palette.background.other,
        borderRadius: '6px',
        height: '33px',
        paddingRight: '40px',
        paddingLeft: '15px',
        marginRight: '-25px',
        display: 'flex',
        alignItems: 'center',
        fontWeight: 600,
        fontSize: '13px',
        textTransform: 'capitalize',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    logo: {
        height: '40px',
    },
    profileButton: {
        '&:hover': {
            background: theme.palette.common.white,
        },
    },
    buttonGroup: {
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
}));

export default function TopHeader() {
    const classes = useStyles();
    const [user] = useUser();
    const Language = useLanguage();
    const Router = useRouter();
    const Confirm = useConfirm();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleCloseMenu = (event) => {
        // if (user.role === 1) setAnchorEl(null);
        if (anchorRef.current && anchorRef.current.contains(event?.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // console.log('user',user);
    // return focus to the button when we transitioned from !open -> open
    // const prevOpen = React.useRef(open);
    // React.useEffect(() => {
    //     if (prevOpen.current === true && open === false) {
    //         anchorRef.current.focus();
    //     }
    //
    //     prevOpen.current = open;
    // }, [open]);

    // const [anchorEl, setAnchorEl] = React.useState(null);
    //
    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };
    //
    // const handleClose = () => {
    //     if (user.role === 1) setAnchorEl(null);
    // };

    const handleLogout = () => {
        Confirm(Language.get('logout.title'), Language.get('logout.message'), 'Ok')
            .then(() => {
                localStorage.removeItem(authCookieName);
                Router.reload();
                handleCloseMenu();
            })
            .catch(() => {});
    };
    // console.log('log data', user);

    return (
        <div className={classes.root}>
            <div className={classes.grow} />
            <Button
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                className={classes.profileButton}
                onClick={handleToggle}
                ref={anchorRef}
            >
                <div className={classes.profile}>{user?.institute?.name}</div>
                <img alt="Profile Logo" className={classes.logo} src={user?.institute.logo ?? ProfileLogo} />
            </Button>
            <Popper anchorEl={anchorRef.current} disablePortal open={open} role={undefined} transition>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleCloseMenu}>
                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                    {user && user.institute && (
                                        <Permit.ADMIN>
                                            <MenuItem
                                                as={`/profile/${user?.institute?._id}`}
                                                component={Link}
                                                href={'/profile/[id]'}
                                                onClick={() => {
                                                    handleCloseMenu();
                                                }}
                                            >
                                                My Profile
                                            </MenuItem>
                                        </Permit.ADMIN>
                                    )}
                                    <Permit.TEACHER strict>
                                        {/*<MenuItem*/}
                                        {/*    as={`/teachers/${user._id}`}*/}
                                        {/*    component={Link}*/}
                                        {/*    href={'/teachers/[id]'}*/}
                                        {/*    onClick={() => {*/}
                                        {/*        handleCloseMenu();*/}
                                        {/*    }}*/}
                                        {/*>*/}
                                        {/*    My Profile*/}
                                        {/*</MenuItem>*/}
                                    </Permit.TEACHER>
                                    <Permit.STUDENT strict>
                                        {/*<MenuItem*/}
                                        {/*    as={`/students/${user._id}`}*/}
                                        {/*    component={Link}*/}
                                        {/*    href={'/students/[id]'}*/}
                                        {/*    onClick={() => {*/}
                                        {/*        handleCloseMenu();*/}
                                        {/*    }}*/}
                                        {/*>*/}
                                        {/*    My Profile*/}
                                        {/*</MenuItem>*/}
                                    </Permit.STUDENT>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
            {/*<Menu anchorEl={anchorEl} id="simple-menu" onClose={handleClose} open={Boolean(anchorEl)}>*/}
            {/*    {user.institute && (*/}
            {/*        <Permit.ADMIN>*/}
            {/*            <MenuItem*/}
            {/*                as={`/institute/${user.institute._id}`}*/}
            {/*                component={Link}*/}
            {/*                href={'/institute/[id]'}*/}
            {/*                onClick={() => setAnchorEl(null)}*/}
            {/*            >*/}
            {/*                My Profile*/}
            {/*            </MenuItem>*/}
            {/*        </Permit.ADMIN>*/}
            {/*    )}*/}

            {/*    <Permit.TEACHER strict>*/}
            {/*        <MenuItem*/}
            {/*            as={`/teachers/${user._id}`}*/}
            {/*            component={Link}*/}
            {/*            href={'/teachers/[id]'}*/}
            {/*            onClick={() => setAnchorEl(null)}*/}
            {/*        >*/}
            {/*            My Profile*/}
            {/*        </MenuItem>*/}
            {/*    </Permit.TEACHER>*/}
            {/*    <Permit.STUDENT strict>*/}
            {/*        <MenuItem*/}
            {/*            as={`/students/${user._id}`}*/}
            {/*            component={Link}*/}
            {/*            href={'/students/[id]'}*/}
            {/*            onClick={() => setAnchorEl(null)}*/}
            {/*        >*/}
            {/*            My Profile*/}
            {/*        </MenuItem>*/}
            {/*    </Permit.STUDENT>*/}
            {/*    <MenuItem onClick={handleLogout}>Logout</MenuItem>*/}
            {/*</Menu>*/}
        </div>
    );
}
