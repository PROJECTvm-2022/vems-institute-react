import React, { useEffect, useState } from 'react';
import { Paper, Typography } from '@material-ui/core/index';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import PhoneIcon from '@material-ui/icons/Phone';
import MailIcon from '@material-ui/icons/Mail';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Translate from '../../components/Translate';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';
import cardImage from '../../../public/Demo picture for teacher and student.png';
import { StudentSeatService } from '../../apis/rest.app';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';
import { useConfirm } from '../../components/Confirm';
import AcceptDialog from './AcceptDialog';
import { useLanguage } from '../../store/LanguageStore';

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
        borderRadius: theme.spacing(0, 0, 1, 1),
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

function StudentGridView({ each, studentData, setStudentData }) {
    const classes = useStyle();
    const { enqueueSnackbar } = useSnackbar();
    const Confirm = useConfirm();
    const Language = useLanguage('students/unapproved');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fullAddress, setFullAddress] = useState([]);

    useEffect(() => {
        let _fullAddress = [];
        if (each?.address?.length) {
            _fullAddress.push(each.address, ',');
        }
        if (each?.city?.length) {
            _fullAddress.push(each.city, ',');
        }
        if (each?.state?.length) {
            _fullAddress.push(each.state);
        }
        setFullAddress(_fullAddress);
    }, [each]);
    // const fullAddress = `${each?.student?.city || 'N/A'} , ${each?.student?.state || 'N/A'}`;

    const handleAccept = () => {
        Confirm('Are you Sure', 'Do you really want to accept this Student', 'Yes, Sure')
            .then(() => {
                setOpen(true);
            })
            .catch(() => {});
    };

    const handleReject = () => {
        Confirm('Are you Sure', 'Do you really want to reject this Student', 'Yes, Sure')
            .then(() => {
                setLoading(true);
                StudentSeatService.patch(each._id, {
                    status: 3,
                })
                    .then(() => {
                        let _studentData = studentData;
                        _studentData.splice(_studentData.indexOf(each), 1);
                        const result = [...studentData];
                        setStudentData(result);
                        enqueueSnackbar(Language.get('rejectedSuccessFully'), {
                            variant: 'success',
                        });
                    })
                    .catch((error) => {
                        enqueueSnackbar(error.message ? error.message : 'Unable to reject request', {
                            variant: 'error',
                        });
                    })
                    .finally(() => setLoading(false));
            })
            .catch(() => {});
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
                            {each?.student?.name?.length > 20
                                ? each.student.name.substring(0, 23) + '...'
                                : each?.student?.name || 'N/A'}
                        </Typography>
                        <div>
                            <Typography color="textSecondary" variant="body2">
                                {fullAddress?.join(' ')?.length > 23
                                    ? fullAddress?.join(' ').substring(0, 23) + '...'
                                    : fullAddress?.join(' ')}{' '}
                            </Typography>
                        </div>
                    </Box>
                    <Box className={classes.iconTypoDiv} display="flex">
                        <Box display="flex" flex="1">
                            <PhoneIcon color={'primary'} />
                            <Box mr={1} />
                            <Typography color="textSecondary" variant={'body2'}>
                                {each?.student?.phone || 'N/A'}
                            </Typography>
                        </Box>
                        <Box display="flex" flex="1">
                            <MailIcon color={'primary'} />
                            <Box mr={1} />
                            <Typography color="textSecondary" variant={'body2'}>
                                {each && each.student.email && each.student.email.length > 15
                                    ? each.student.email.substring(0, 15) + '...'
                                    : each.student.email}
                            </Typography>
                        </Box>
                    </Box>
                    <Box display="flex">
                        <Box display="flex" flex="1" p={2}>
                            <Button
                                color={'primary'}
                                disabled={loading}
                                fullWidth
                                onClick={handleReject}
                                variant={'contained'}
                            >
                                {loading ? <CircularProgress size={15} /> : <Translate>{'student.reject'}</Translate>}
                            </Button>
                        </Box>
                        <Box display="flex" flex="1" p={2}>
                            <Button
                                color={'primary'}
                                disabled={loading}
                                fullWidth
                                onClick={handleAccept}
                                variant={'contained'}
                            >
                                {loading ? <CircularProgress size={15} /> : <Translate>{'student.accept'}</Translate>}
                            </Button>
                        </Box>
                    </Box>
                    {/*<Button*/}
                    {/*    as={'/students/[studentId]'}*/}
                    {/*    className={classes.profileButton}*/}
                    {/*    color="primary"*/}
                    {/*    fullWidth*/}
                    {/*    href={`/students/${each?.student?._id}`}*/}
                    {/*    size="large"*/}
                    {/*    variant="contained"*/}
                    {/*>*/}
                    {/*    <Translate>{'student.view_profile'}</Translate>*/}
                    {/*</Button>*/}
                </Paper>
            </Grid>
            <AcceptDialog
                each={each}
                open={open}
                setOpen={setOpen}
                setStudentData={setStudentData}
                studentData={studentData}
            />
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
