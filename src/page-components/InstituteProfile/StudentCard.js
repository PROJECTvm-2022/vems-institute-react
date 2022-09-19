import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import PhoneIcon from '@material-ui/icons/Phone';
import MailIcon from '@material-ui/icons/Mail';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Translate from '../../components/Translate';
import Confirm from '../../components/Confirm';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../../store/LanguageStore';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import cardImage from '../../../public/Demo picture for teacher and student.png';
import { TeacherStudentService } from '../../apis/rest.app';

const useStyle = makeStyles((theme) => ({
    avatar: {
        height: 75,
        width: 75,
        fontSize: 39,
        marginTop: -28,
        border: 'solid 4px #fff',
        background: theme.palette.primary.main,
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconButton: {
        color: theme.palette.common.white,
    },
    coverImg: {
        width: '100%',
        height: 50,
    },
    typoDiv2: {
        padding: theme.spacing(2),
    },
    buttons: {
        padding: theme.spacing(1),
    },
    cameraIcon: {
        height: 22,
        width: 22,
        background: theme.palette.secondary.main,
        cursor: 'pointer',
        margin: '-8px 0px 0px -8px',
    },
    cameraIconImage: {
        height: 14,
        width: 14,
        color: 'white',
    },
    boxStyle: {
        backgroundColor: '#c1c1c1',
        height: 50,
    },
    divider: {
        backgroundColor: '#DADADA',
        height: 40,
    },
    profileButton: {
        borderRadius: '0px 0px 8px 8px',
    },
    rootPaper: {
        borderRadius: 8,
    },
    marginRight: {
        marginRight: theme.spacing(1),
    },
}));

function CardForStudent({ each, position, studentData, setStudentData }) {
    const classes = useStyle();

    const { enqueueSnackbar } = useSnackbar();
    const fullAddress = each?.user?.address || 'NA' + ',' + each?.user?.city || 'NA' + ',' + each?.user?.state || 'NA';
    const Language = useLanguage('students');

    const handleApprove = () => {
        Confirm(
            Language.get('teacher.form.confirmDialog.titleForDelete'),
            Language.get('teacher.form.confirmDialog.messageForApprove'),
            Language.get('teacher.form.confirmDialog.okLebel1'),
            Language.get('teacher.form.confirmDialog.options'),
        ).then(() => {
            // approveTeacher(each._id)
            //     .then(() => {
            //         let _studentData = studentData;
            //         _studentData.splice(position, 1);
            //         setStudentData([..._studentData]);
            //         enqueueSnackbar(Language.get('teacher.form.message.approvedMessage'), {
            //             variant: 'success',
            //         });
            //     })
            //     .catch((error) => {
            //         enqueueSnackbar(error.message ? error.message : Language.get('teacher.form.error.deleteError'), {
            //             variant: 'error',
            //         });
            //     });
        });
    };

    const handleReject = () => {
        Confirm(Language.get('confirmTitle'), Language.get('rejectMessage'))
            .then(() => {
                TeacherStudentService.remove(each._id)
                    .then(() => {
                        let _studentData = studentData;
                        _studentData.splice(position, 1);
                        setStudentData([..._studentData]);
                        enqueueSnackbar(Language.get('teacher.form.message.rejectMessage'), {
                            variant: 'success',
                        });
                    })
                    .catch((error) => {
                        enqueueSnackbar(
                            error.message ? error.message : Language.get('teacher.form.error.deleteError'),
                            { variant: 'error' },
                        );
                    });
            })
            .catch(() => {});
    };

    return (
        <>
            <Grid item md={4} sm={6} xs={12}>
                <Paper className={classes.rootPaper}>
                    <Box>
                        <img alt={''} className={classes.coverImg} src={cardImage} />
                    </Box>
                    <Box alignItems="center" display="flex" justifyContent="center">
                        <Avatar className={classes.avatar} src={each && each.user && each.user.avatar}>
                            {each?.user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                    </Box>
                    <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center" p={0.5}>
                        <Typography component="p" variant="h4">
                            {each?.user?.name?.length > 23 ? each.user.name.substring(0, 23) + '...' : each.user.name}
                        </Typography>
                        <Box display="flex">
                            <Typography color="textSecondary" variant="body2">
                                {fullAddress?.length > 23 ? fullAddress.substring(0, 23) + '...' : fullAddress}
                            </Typography>
                        </Box>
                    </Box>
                    <Box className={classes.typoDiv2} display="flex">
                        <Box display="flex" flex="1">
                            <PhoneIcon className={classes.marginRight} color={'primary'} />
                            <Typography color="textSecondary" variant={'body2'}>
                                {each?.user?.phone || 'N/A'}
                            </Typography>
                        </Box>
                        <Box display="flex" flex="1">
                            <MailIcon className={classes.marginRight} color={'primary'} />
                            <Typography color="textSecondary" variant={'body2'}>
                                {each?.user?.email?.length > 15
                                    ? each.user.email.substring(0, 15) + '...'
                                    : each.user.email}
                            </Typography>
                        </Box>
                    </Box>
                    <Box alignItems="center" className={classes.buttons} display="flex" justifyContent="space-between">
                        <Button
                            color="primary"
                            disabled={each.status === 1}
                            fullWidth
                            onClick={handleReject}
                            size={'small'}
                            variant="contained"
                        >
                            <Translate root={'students'}>{'reject'}</Translate>
                        </Button>
                        <Box mr={2} />
                        <Button
                            color="primary"
                            disabled={each.status === 1}
                            fullWidth
                            onClick={handleApprove}
                            size={'small'}
                            variant="contained"
                        >
                            <Translate root={'students'}>{'accept'}</Translate>
                        </Button>
                    </Box>
                    <Button
                        as={'/students/[id]'}
                        className={classes.profileButton}
                        color="primary"
                        fullWidth
                        href={`/students/${each._id}`}
                        size="large"
                        variant="contained"
                    >
                        <Translate root={'students'}>{'view_profile'}</Translate>
                    </Button>
                </Paper>
            </Grid>
        </>
    );
}
CardForStudent.propTypes = {
    each: PropTypes.any.isRequired,
    position: PropTypes.number.isRequired,
    studentData: PropTypes.array.isRequired,
    setStudentData: PropTypes.func.isRequired,
};
export default CardForStudent;
