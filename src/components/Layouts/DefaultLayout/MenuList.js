/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description Menu List
 * @createdOn 26/12/20 12:36 AM
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import clsx from 'clsx';
import Link from '../../Link';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

const useStyle = makeStyles((theme) => ({
    itemTitle: {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1.2),
        color: theme.palette.primary.main,
    },
    divider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        border: `1px solid ${theme.palette.divider}`,
    },
    item: {
        height: '45px',
        margin: theme.spacing(0.5),
        borderRadius: '7px',
        color: theme.palette.background.secondary,
        // '&:hover,&:focus': {
        //     backgroundColor: theme.palette.primary.light,
        // },
        [theme.breakpoints.down('xs')]: {
            width: '200px',
        },
    },
    itemClose: {
        height: '45px',
        width: '45px',
        margin: theme.spacing(0.8),
        borderRadius: '50px',
        padding: '0px',
        color: theme.palette.background.secondary,
        '&:hover,&:focus': {
            // backgroundColor: theme.palette.background.drawer,
        },
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: '0.4s',
        }),
    },
    itemActiveItem: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        boxShadow: `2px 4px 11px ${theme.palette.primary.light}`,
        '&:hover,&:focus': {
            backgroundColor: theme.palette.primary.main,
        },
    },
    itemPrimary: {
        fontSize: 'inherit',
        marginLeft: theme.spacing(1),
    },

    itemIcon: {
        minWidth: 'auto',
        margin: theme.spacing(1.2),
        marginLeft: theme.spacing(2),
    },
    closeItemIcon: {
        margin: theme.spacing(1.5),
    },
    listIcon: {
        color: 'inherit',
    },
}));

const MenuList = ({ open, categories }) => {
    const classes = useStyle();

    const Router = useRouter();

    return (
        <React.Fragment>
            {categories.map(({ id, children }) => (
                <React.Fragment key={id}>
                    <ListItem component="div">
                        <ListItemText>
                            {open ? (
                                <Typography className={classes.itemTitle} variant="subtitle2">
                                    {id}
                                </Typography>
                            ) : (
                                <Divider className={classes.divider} variant={'middle'} />
                            )}
                        </ListItemText>
                    </ListItem>
                    {children.map(({ id: childId, icon, href, active, selectedIcon }) => (
                        <Box display="flex" key={childId}>
                            <Tooltip TransitionComponent={Zoom} placement="right" title={!open ? childId : ''}>
                                <ListItem
                                    as={href}
                                    button
                                    className={clsx(
                                        {
                                            [classes.item]: open,
                                            [classes.itemClose]: !open,
                                        },
                                        (Router.pathname === href || active) && classes.itemActiveItem,
                                    )}
                                    component={Link}
                                    href={href}
                                    key={childId}
                                    // variant="outlined"
                                >
                                    <ListItemIcon
                                        className={clsx(classes.listIcon, {
                                            [classes.itemIcon]: open,
                                            [classes.closeItemIcon]: !open,
                                        })}
                                    >
                                        {Router.pathname === href || active ? selectedIcon || icon : icon}
                                    </ListItemIcon>
                                    {open ? (
                                        <ListItemText
                                            classes={{
                                                primary: classes.itemPrimary,
                                            }}
                                        >
                                            {childId}
                                        </ListItemText>
                                    ) : (
                                        ''
                                    )}
                                </ListItem>
                            </Tooltip>
                        </Box>
                    ))}
                </React.Fragment>
            ))}
        </React.Fragment>
    );
};

MenuList.propTypes = {
    open: PropTypes.bool.isRequired,
    categories: PropTypes.array.isRequired,
};

export default MenuList;
