import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import ImageBackground from '../../../public/background_profile.svg';
import { Avatar, Button, Typography } from '@material-ui/core/index';
import Translate from '../../components/Translate';
import { useInstituteDetailsData } from '../../store/InstitutionDetailsContext';
import EditIcon from '../../../public/EditIcon.svg';
import Hidden from '@material-ui/core/Hidden';
import ImageEditDialog from './ImageEditDialog';
import InstitutionEditDialog from './InstitutionEditDialog';
import { useUser } from '../../store/UserContext';
import CoverEditDialog from './CoverEditDialog';

const useStyles = makeStyles((theme) => ({
    main: {
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    coverImage: {
        width: '100%',
        height: 180,
        objectFit: 'cover',
    },
    root: {
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center',
            width: '100%',
        },
    },
    avatarProfile: {
        width: 180,
        height: 180,
        marginTop: theme.spacing(-1 * 10),
        marginLeft: theme.spacing(0.5),
        border: '3px solid white',
    },
    buttonProfile: {
        height: 40,
        width: 140,
        color: theme.palette.common.white,
        marginLeft: theme.spacing(1),
        padding: theme.spacing(0, 2),
        [theme.breakpoints.down('sm')]: {
            height: 35,
            width: 120,
        },
    },
    typoProfile: {
        textTransform: 'capitalize',
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
        },
    },
    editButton: {
        minWidth: 0,
        borderRadius: '50px',
        height: '40px',
        width: '40px',
    },
}));

export default function TopHeaderProfile() {
    const [data] = useInstituteDetailsData();
    const [user] = useUser();
    const classes = useStyles();

    const [openDialog, setOpenDialog] = useState(false);
    const [openCoverDialog, setOpenCoverDialog] = useState(false);
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const [tableOpen, setTableOpen] = useState(false);
    const handleButtonOpen = () => {
        setTableOpen(true);
    };

    // console.log('user.....',user);

    return (
        <Box display="flex" flexDirection="column">
            <Box className={classes.main} display="flex">
                <img
                    alt={'background-image'}
                    className={classes.coverImage}
                    src={user?.institute?.cover ?? ImageBackground}
                />
                <Box display={'flex'} ml={-6} mt={2}>
                    <Button
                        className={classes.editButton}
                        onClick={() => {
                            setOpenCoverDialog(true);
                        }}
                        style={{
                            background: user && user?.institute?.colorCode && user?.institute?.colorCode?.primary,
                        }}
                        variant={'contained'}
                    >
                        <img alt={'Edit Icon'} src={EditIcon} />
                    </Button>
                </Box>
            </Box>
            <Box className={classes.main} display="flex">
                <Box className={classes.root} display={'flex'}>
                    <Avatar className={classes.avatarProfile} src={user && user?.institute.logo} />
                    <Box display={'flex'} ml={-4.5} mt={5}>
                        <Button
                            className={classes.editButton}
                            onClick={() => {
                                handleOpenDialog();
                            }}
                            style={{
                                background: user && user?.institute?.colorCode && user?.institute?.colorCode?.primary,
                            }}
                            variant={'contained'}
                        >
                            <img alt={'Edit Icon'} src={EditIcon} />
                        </Button>
                    </Box>
                </Box>
                <Hidden smDown>
                    <Box display="flex" mb={2} ml={2} mt={2} width="100%">
                        <Box flexGrow={1}>
                            <Typography className={classes.typoProfile} variant={'h3'}>
                                {user && user.institute.name}
                            </Typography>
                            {/*<Typography className={classes.typoProfile} variant={'body2'}>*/}
                            {/*    {data && data.city}*/}
                            {/*    {', '}*/}
                            {/*    {data && data.state}*/}
                            {/*    {', '}*/}
                            {/*    {data && data.pin}*/}
                            {/*</Typography>*/}
                        </Box>
                        {/*<Button*/}
                        {/*    className={classes.buttonProfile}*/}
                        {/*    href={data && data.website}*/}
                        {/*    size={'small'}*/}
                        {/*    style={{ background: data && data.colorCode && data.colorCode.primary }}*/}
                        {/*    target={'_blank'}*/}
                        {/*    variant={'contained'}*/}
                        {/*>*/}
                        {/*    <Translate>{'institute.details.visitWebsite'}</Translate>*/}
                        {/*</Button>*/}
                        <Button
                            className={classes.buttonProfile}
                            onClick={() => {
                                handleButtonOpen();
                            }}
                            size={'small'}
                            style={{
                                color: user && user?.institute?.colorCode && user?.institute?.colorCode?.primary,
                                border: `1px solid ${
                                    user && user?.institute?.colorCode && user?.institute?.colorCode?.primary
                                }`,
                            }}
                            variant={'outlined'}
                        >
                            <Translate>{'Edit'}</Translate>
                        </Button>
                    </Box>
                </Hidden>
                <Hidden mdUp>
                    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} mt={2}>
                        <Box alignItems={'center'} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                            <Typography className={classes.typoProfile} variant={'h3'}>
                                {user && user.name}
                            </Typography>
                            {/*<Typography className={classes.typoProfile} variant={'body2'}>*/}
                            {/*    {data && data.city}*/}
                            {/*    {', '}*/}
                            {/*    {data && data.state}*/}
                            {/*    {', '}*/}
                            {/*    {data && data.pin}*/}
                            {/*</Typography>*/}
                        </Box>
                        <Box alignItems={'center'} display={'flex'} justifyContent={'center'} my={1}>
                            <Button
                                className={classes.buttonProfile}
                                href={data && data.website}
                                size={'small'}
                                style={{
                                    background:
                                        user && user?.institute?.colorCode && user?.institute?.colorCode?.primary,
                                }}
                                target={'_blank'}
                                variant={'contained'}
                            >
                                <Translate>{'institute.details.visitWebsite'}</Translate>
                            </Button>
                            <Button
                                className={classes.buttonProfile}
                                onClick={() => {
                                    handleButtonOpen();
                                }}
                                size={'small'}
                                style={{
                                    color: user && user?.institute?.colorCode && user?.institute?.colorCode?.primary,
                                    border: `1px solid ${
                                        user && user?.institute?.colorCode && user?.institute?.colorCode?.primary
                                    }`,
                                }}
                                variant={'outlined'}
                            >
                                <Translate>{'institute.details.editProfile'}</Translate>
                            </Button>
                        </Box>
                    </Box>
                </Hidden>
            </Box>
            <ImageEditDialog
                each={user?.institute}
                onProfile={true}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            />
            <CoverEditDialog
                each={user?.institute}
                onProfile={true}
                openDialog={openCoverDialog}
                setOpenDialog={setOpenCoverDialog}
            />
            <InstitutionEditDialog
                each={user?.institute}
                onEditContact={false}
                onProfile={true}
                setTableOpen={setTableOpen}
                tableOpen={tableOpen}
            />
        </Box>
    );
}
