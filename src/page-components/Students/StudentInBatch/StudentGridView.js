import React, { useEffect, useState } from 'react';
import { Paper, Typography } from '@material-ui/core/index';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import PhoneIcon from '@material-ui/icons/Phone';
import MailIcon from '@material-ui/icons/Mail';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Translate from '../../../components/Translate';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';
import cardImage from '../../../../public/Demo picture for teacher and student.png';
import Divider from '@material-ui/core/Divider';
import Confirm from '../../../components/Confirm';
import { QuestionsService, StudentSeatService } from '../../../apis/rest.app';
import { useSnackbar } from 'notistack';
import useHandleError from '../../../hooks/useHandleError';

const useStyle = makeStyles((theme) => ({
    avatar: {
        height: 75,
        width: 75,
        marginTop: theme.spacing(-4),
        fontSize: 39,
        textTransform: 'capitalize',
        border: 'solid 4px #fff',
        background: theme.palette.primary.main,
    },
    iconButton: {
        color: theme.palette.common.white,
    },
    typoDiv3: {
        padding: theme.spacing(1),
    },
    iconTypoDiv: {
        padding: theme.spacing(2),
    },
    typoDiv4: {
        padding: theme.spacing(1),
    },
    profileButton: {
        borderRadius: theme.spacing(0, 0, 0, 1),
    },
    profileButton3: {
        borderRadius: theme.spacing(0, 0, 1, 1),
    },
    profileButton2: {
        borderRadius: theme.spacing(0, 0, 1, 0),
    },
    cameraIcon: {
        height: 22,
        width: 22,
        background: theme.palette.secondary.main,
        cursor: 'pointer',
        margin: theme.spacing(-1, 0, 0, -1),
    },
    cameraIconImage: {
        height: 14,
        width: 14,
        color: 'white',
    },
    coverImg: {
        width: '100%',
        height: 50,
    },
    boxStyle: {
        backgroundColor: theme.palette.background.common,
        height: 50,
    },
    rootPaper: {
        borderRadius: theme.spacing(1),
    },
}));

function StudentGridView({ each, removingStudent, studentData, setStudentData, position }) {
    const classes = useStyle();
    const { enqueueSnackbar } = useSnackbar();
    const handleError = useHandleError();

    const [fullAddress, setFullAddress] = useState([]);

    useEffect(() => {
        let _fullAddress = [];
        if (each?.address?.length) {
            _fullAddress.push(each?.address, ',');
        }
        if (each?.city?.length) {
            _fullAddress.push(each?.city, ',');
        }
        if (each?.state?.length) {
            _fullAddress.push(each?.state);
        }
        setFullAddress(_fullAddress);
    }, [each]);
    const removeFromBatch = () => {
        Confirm('Are you sure', `Do you really wants to remove ${each?.name} from the batch`, 'yes', 'cancel').then(
            () => {
                StudentSeatService.remove(each._id)
                    .then(() => {
                        let _allQuestions = studentData;
                        setStudentData([]);
                        _allQuestions.splice(position, 1);
                        setStudentData([..._allQuestions]);
                        enqueueSnackbar('Deleted Successfully', {
                            variant: 'success',
                        });
                    })
                    .catch((error) => {
                        handleError()(error);
                    });
            },
        );
    };

    return (
        <>
            <Grid item md={4} sm={6} xs={12}>
                <Paper className={classes.rootPaper}>
                    <Box>
                        <img alt={'cover-image'} className={classes.coverImg} src={cardImage} />
                    </Box>
                    <Box alignItems="center" display="flex" justifyContent="center">
                        <Badge
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            overlap="circle"
                        >
                            <Box className={classes.avatar} component={Avatar} src={each?.avatar}>
                                {each?.name?.charAt(0)}
                            </Box>
                        </Badge>
                    </Box>
                    <Box
                        alignItems="center"
                        className={classes.typoDiv3}
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                    >
                        <Typography component="p" variant="h4">
                            {each?.name?.length > 20 ? each?.name.substring(0, 23) + '...' : each?.name || 'N/A'}
                        </Typography>
                        <div>
                            <Typography color="textSecondary" variant="body2">
                                {fullAddress?.join(' ')?.length > 23
                                    ? fullAddress?.join(' ').substring(0, 23) + '...'
                                    : fullAddress?.join(' ')}
                                {/*{fullAddress?.join(',')}*/}
                            </Typography>
                        </div>
                    </Box>
                    <Box className={classes.iconTypoDiv} display="flex">
                        <Box display="flex" flex="1">
                            <PhoneIcon color={'primary'} />
                            <Box mr={1} />
                            <Typography color="textSecondary" variant={'body2'}>
                                {each?.phone || 'N/A'}
                            </Typography>
                        </Box>
                        <Box display="flex" flex="1">
                            <MailIcon color={'primary'} />
                            <Box mr={1} />
                            <Typography color="textSecondary" variant={'body2'}>
                                {each && each?.email && each?.email?.length > 15
                                    ? each?.email.substring(0, 15) + '...'
                                    : each?.email}
                            </Typography>
                        </Box>
                    </Box>
                    <Box display={'flex'}>
                        <Button
                            as={'/students/[studentId]'}
                            className={removingStudent === 1 ? classes.profileButton : classes.profileButton3}
                            color="primary"
                            fullWidth
                            href={`/students/${each?._id}`}
                            size="large"
                            variant="contained"
                        >
                            <Translate>{'student.view_profile'}</Translate>
                        </Button>
                        {removingStudent === 1 && (
                            <>
                                <Divider orientation={'horizontal'} />
                                <Button
                                    className={classes.profileButton2}
                                    color="primary"
                                    fullWidth
                                    onClick={removeFromBatch}
                                    size="large"
                                    variant="contained"
                                >
                                    <Translate>{'Remove'}</Translate>
                                </Button>
                            </>
                        )}
                    </Box>
                </Paper>
            </Grid>
        </>
    );
}
StudentGridView.propTypes = {
    studentData: PropTypes.array.isRequired,
    setCourse: PropTypes.any,
    each: PropTypes.any,
    position: PropTypes.any,
    setStudentData: PropTypes.func.isRequired,
};

export default StudentGridView;
