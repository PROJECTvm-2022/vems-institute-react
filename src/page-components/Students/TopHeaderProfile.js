import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import ImageBackground from '../../../public/background_profile.svg';
import { Avatar, Typography } from '@material-ui/core/index';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import EditIcon from '../../../public/EditIcon.svg';
import Translate from '../../components/Translate';
import { useStudentDetailsData } from '../../store/StudentDetailsContext';
import StudentEditDialog from '../../page-components/Students/StudentEditDialog';
import ImageEditDialogForStudent from '../../page-components/Students/ImageEditDialogForStudent';
import PermissionDialogForStudent from './PermissionDialogForStudent';
import { ModuleService } from '../../apis/rest.app';
import {useSnackbar} from "notistack";

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
    const [data] = useStudentDetailsData();
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [modules, setModules] = useState([]);

    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const handleButtonOpen = () => {
        setOpenEditDialog(true);
    };

    const [openDialog, setOpenDialog] = useState(false);
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    useEffect(() => {
        ModuleService.find({
            query: {
                type: 2,
            },
        })
            .then((res) => {
                setModules(res);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : Language.get('Something Went Wrong'), {
                    variant: 'error',
                });
            });
    }, []);

    return (
        <Box display="flex" flexDirection="column">
            <img alt={'background-image'} className={classes.coverImage} src={ImageBackground} />
            <Box className={classes.main} display="flex">
                <Box className={classes.root} display={'flex'}>
                    <Avatar className={classes.avatarProfile} src={data && data.avatar} />
                    {/*<Box display={'flex'} ml={-4.5} mt={5}>*/}
                    {/*<Button*/}
                    {/*    className={classes.editButton}*/}
                    {/*    color={'primary'}*/}
                    {/*    onClick={() => {*/}
                    {/*        handleOpenDialog();*/}
                    {/*    }}*/}
                    {/*    variant={'contained'}*/}
                    {/*>*/}
                    {/*    <img alt={'Edit Icon'} src={EditIcon} />*/}
                    {/*</Button>*/}
                    {/*</Box>*/}
                </Box>
                <Hidden smDown>
                    <Box display="flex" mb={2} ml={2} mt={2} width="100%">
                        <Box flexGrow={1}>
                            <Typography className={classes.typoProfile} variant={'h3'}>
                                {data && data.name}
                            </Typography>
                            <Typography className={classes.typoProfile} variant={'body2'}>
                                {data?.city || 'N/A'}
                                {', '}
                                {data?.state || 'N/A'}
                                {', '}
                                {data?.pin || 'N/A'}
                            </Typography>
                        </Box>
                        <Button
                            className={classes.buttonProfile}
                            color={'primary'}
                            onClick={() => {
                                setOpen(true);
                            }}
                            size={'small'}
                            variant={'contained'}
                        >
                            <Translate>{'Permissions'}</Translate>
                        </Button>
                        <Button
                            className={classes.buttonProfile}
                            color={'primary'}
                            href={`/Student-live-class/${data._id}`}
                            size={'small'}
                            variant={'contained'}
                        >
                            <Translate root={'students/[id]'}>{'All LiveClass'}</Translate>
                        </Button>
                        <Button
                            className={classes.buttonProfile}
                            color={'primary'}
                            href={`/all-exams/${data._id}`}
                            size={'small'}
                            variant={'contained'}
                        >
                            <Translate root={'students/[id]'}>{'details.editProfile'}</Translate>
                        </Button>
                    </Box>
                </Hidden>
                <Hidden mdUp>
                    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} mt={2}>
                        <Box alignItems={'center'} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                            <Typography className={classes.typoProfile} variant={'h3'}>
                                {data && data.name}
                            </Typography>
                            <Typography className={classes.typoProfile} variant={'body2'}>
                                {data && data.city}
                                {', '}
                                {data && data.state}
                                {', '}
                                {data && data.pin}
                            </Typography>
                        </Box>
                        {/*<Box alignItems={'center'} display={'flex'} justifyContent={'center'} my={1}>*/}
                        {/*    <Button*/}
                        {/*        className={classes.buttonProfile}*/}
                        {/*        color={'primary'}*/}
                        {/*        onClick={() => {*/}
                        {/*            handleButtonOpen();*/}
                        {/*        }}*/}
                        {/*        size={'small'}*/}
                        {/*        variant={'contained'}*/}
                        {/*    >*/}
                        {/*        <Translate root={'students/[id]'}>{'details.editProfile'}</Translate>*/}
                        {/*    </Button>*/}
                        {/*</Box>*/}
                    </Box>
                </Hidden>
            </Box>
            <StudentEditDialog
                each={data}
                onProfile={true}
                openEditDialog={openEditDialog}
                setOpenEditDialog={setOpenEditDialog}
            />
            <ImageEditDialogForStudent
                each={data}
                onProfile={true}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            />
            <PermissionDialogForStudent open={open} setOpen={setOpen} data={data} modules={modules}/>
        </Box>
    );
}

// TopHeaderProfile.propTypes = {
//     institute: PropTypes.object.isRequired,
// };
