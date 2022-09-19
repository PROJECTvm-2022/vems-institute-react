/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description Drop Down Menu List
 * @createdOn 26/12/20 1:34 AM
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import MenuList from './MenuList';
import MenuIcon from '../../../assets/MenuIcon.svg';
import Box from '@material-ui/core/Box';
import PopupState, { bindHover, bindPopover } from 'material-ui-popup-state';
import Translate from '../../Translate';

const useStyle = makeStyles((theme) => ({
    main: {
        marginTop: theme.spacing(2),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    button: {
        height: '54px',
        borderRadius: '0px',
        fontWeight: 500,
        color: theme.palette.background.secondary,
        '&:hover': {
            backgroundColor: theme.palette.background.common,
            color: theme.palette.primary.main,
        },
    },
    title: {
        '&:hover': {},
    },
}));

const DropDownMenuList = ({ categories }) => {
    const classes = useStyle();

    return (
        <React.Fragment>
            <PopupState popupId="demo-popup-popper" variant="popper">
                {(popupState) => (
                    <>
                        <div className={classes.popupstateButton} {...bindHover(popupState)}>
                            <Button className={classes.button} size={'large'}>
                                <img alt={'Menu Icon'} src={MenuIcon} />
                                <Box ml={1.3} />
                                <Translate>{'menu'}</Translate>
                            </Button>
                        </div>
                        <Popper
                            className={classes.popperRoot}
                            modifiers={{
                                flip: {
                                    enabled: false,
                                },
                                preventOverflow: {
                                    enabled: true,
                                    boundariesElement: 'undefined',
                                },
                            }}
                            placement="bottom-start"
                            {...bindPopover(popupState)}
                        >
                            <Paper className={classes.main}>
                                <MenuList categories={categories} open={true} />
                            </Paper>
                        </Popper>
                    </>
                )}
            </PopupState>
        </React.Fragment>
    );
};

export default DropDownMenuList;
