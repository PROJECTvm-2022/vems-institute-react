import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useInstituteDetailsData } from '../../store/InstitutionDetailsContext';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { Divider, IconButton, Typography } from '@material-ui/core/index';
import Translate from '../../components/Translate';
import EditIcon from '../../../public/EditIcon.svg';
import InstitutionEditDialog from './InstitutionEditDialog';
import ColorEditDialog from './ColorEditDialog';
import {useUser} from "../../store/UserContext";

const useStyles = makeStyles((theme) => ({
    headerCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(0.5, 1),
        background: theme.palette.primary.main,
        borderRadius: theme.spacing(0.5),
    },
    contentCard: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1),
    },
    rootCard: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1),
    },
    headerTypo: {
        color: theme.palette.common.white,
    },
    buttonProfile: {
        color: theme.palette.common.white,
    },
    subTitle: {
        fontWeight: 500,
        color: theme.palette.text.other,
    },
}));

export default function DetailsLeftProfile() {
    const [data] = useInstituteDetailsData();
    const [user, setUser] = useUser();
    const classes = useStyles();
    const [tableOpen, setTableOpen] = useState(false);
    const handleButtonOpen = () => {
        setTableOpen(true);
    };

    const [colorEditor, setColorEditor] = useState(false);
    const handleOpenColorEditor = () => {
        setColorEditor(true);
    };

    return (
        <>
            <Paper className={classes.rootCard}>
                <div
                    className={classes.headerCard}
                    style={{ background: user && user?.institute?.colorCode &&  user?.institute?.colorCode?.primary }}
                >
                    <Typography className={classes.headerTypo} variant={'h4'}>
                        <Translate>{'institute.details.contactDetails'}</Translate>
                    </Typography>
                    <IconButton
                        onClick={() => {
                            handleButtonOpen();
                        }}
                    >
                        <img alt={'Edit Icon'} src={EditIcon} />
                    </IconButton>
                </div>
                <div className={classes.contentCard}>
                    <Typography className={classes.subTitle} variant={'caption'}>
                        <Translate>{'institute.details.number'}</Translate>
                    </Typography>
                    <Typography variant={'h6'}>{user && user?.institute?.phone}</Typography>
                </div>
                <Divider />
                <div className={classes.contentCard}>
                    <Typography className={classes.subTitle} variant={'caption'}>
                        <Translate>{'institute.details.email'}</Translate>
                    </Typography>
                    <Typography variant={'h6'}>{user && user?.institute?.email}</Typography>
                </div>
                <Divider />
                <div className={classes.contentCard}>
                    <Typography className={classes.subTitle} variant={'caption'}>
                        {'Website'}
                    </Typography>
                    <Typography variant={'h6'}>{user && user?.institute?.website}</Typography>
                </div>
                <div className={classes.contentCard}>
                    <Typography className={classes.subTitle} variant={'caption'}>
                        <Translate>{'institute.details.address'}</Translate>
                    </Typography>
                    <Typography variant={'h6'}>{user && user?.institute?.address}</Typography>
                </div>
                {/*<Divider />*/}
                {/*<div className={classes.contentCard}>*/}
                {/*    <Typography className={classes.subTitle} variant={'caption'}>*/}
                {/*        <Translate>{'institute.details.website'}</Translate>*/}
                {/*    </Typography>*/}
                {/*    <Typography variant={'h6'}>{data && data.website}</Typography>*/}
                {/*</div>*/}
            </Paper>
            <Box mt={3} />
            <Paper className={classes.rootCard}>
                <div
                    className={classes.headerCard}
                    style={{ background: user && user?.institute?.colorCode &&  user?.institute?.colorCode?.primary }}
                >
                    <Typography className={classes.headerTypo} variant={'h4'}>
                        <Translate>{'institute.details.appearance'}</Translate>
                    </Typography>
                    <IconButton
                        onClick={() => {
                            handleOpenColorEditor();
                        }}
                    >
                        <img alt={'Edit icon'} src={EditIcon} />
                    </IconButton>
                </div>
                <div className={classes.subTitle}>
                    <Typography variant={'caption'}>
                        <Translate>{'institute.details.theme'}</Translate>
                    </Typography>
                    <Box
                        bgcolor={user && user?.institute?.colorCode ? user?.institute?.colorCode?.primary : 'primary.main'}
                        color="white"
                        mt={1}
                        px={2}
                        py={1}
                        width="fit-content"
                    >
                        {user && user?.institute?.colorCode &&  user?.institute?.colorCode?.primary}
                    </Box>
                </div>
            </Paper>
            <Box mt={3} />
            {/*<Paper className={classes.rootCard}>*/}
            {/*    <Button*/}
            {/*        className={classes.buttonProfile}*/}
            {/*        fullWidth*/}
            {/*        href={`/all-transaction?institute=${data._id}`}*/}
            {/*        style={{ background: data && data.colorCode && data.colorCode.primary }}*/}
            {/*        variant={'contained'}*/}
            {/*    >*/}
            {/*        <Translate>{'institute.details.viewTransactions'}</Translate>*/}
            {/*    </Button>*/}
            {/*</Paper>*/}
            <InstitutionEditDialog
                each={user?.institute}
                onEditContact={true}
                onProfile={true}
                setTableOpen={setTableOpen}
                tableOpen={tableOpen}
            />
            <ColorEditDialog colorEditor={colorEditor} each={user?.institute} onProfile={true} setColorEditor={setColorEditor} />
        </>
    );
}
