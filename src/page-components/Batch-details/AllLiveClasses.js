import React, { useEffect, useState } from 'react';
// import Button from '@material-ui/core/Button';
import Translate from '../../../src/components/Translate';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useHandleError from '../../../src/hooks/useHandleError';
import Grid from '@material-ui/core/Grid';
// import Hidden from '@material-ui/core/Hidden';
import CardForAttendance from '../../../src/page-components/Attendance/CardForAttendance';
import { allAttendanceService } from '../../apis/rest.app';
import { useRouter } from 'next/router';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/styles';
import InputBase from '@material-ui/core/InputBase';
import { useLanguage } from '../../store/LanguageStore';
// import InstituteSkeleton from '../../../src/components/Skeleton/InstituteSkeleton';
import LiveClassSkeleton from '../../../src/components/Skeleton/LiveClassSkeleton';

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: 20,
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: '#ebf5fc',
        fontSize: 12,
        color: theme?.palette?.primary?.main,
        padding: '4px 10px 4px 10px',
        transition: theme?.transitions?.create(['box-shadow']),
    },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
    buttonDiv: {
        fontWeight: 500,
        fontSize: 13,
    },
    switchButtonIcon: {
        marginLeft: theme.spacing(1),
        color: theme.palette.primary.main,
    },
    mainDiv: {
        marginTop: theme.spacing(3),
    },
}));

const Attendance = ({ id }) => {
    const classes = useStyles();
    const Language = useLanguage('batch-details/[batchDetailsById]');
    const handleError = useHandleError();
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    // const Router = useRouter();
    // const { id } = Router.query;
    const [typeOfLiveClass, setTypeOfLiveClass] = useState(1);
    const liveClassType = [
        {
            name: Language.get('UpComing'),
            value: 2,
        },
        {
            name: Language.get('OnGoing'),
            value: 3,
        },
        {
            name: Language.get('Completed'),
            value: 4,
        },
    ];
    // console.log('typeOfLiveClass', typeOfLiveClass);

    useEffect(() => {
        setLoading(true);
        let data;
        // if (attendanceData.length === 0 && id) {
        if (typeOfLiveClass === 1) {
            data = {
                instituteBatch: id,
                $populate: ['teacher', 'teacherSlot'],
                status: { $in: [1, 2, 4] },
            };
        } else if (typeOfLiveClass === 2) {
            data = {
                instituteBatch: id,
                $populate: ['teacher', 'teacherSlot'],
                status: { $in: [1] },
            };
        } else if (typeOfLiveClass === 3) {
            data = {
                instituteBatch: id,
                $populate: ['teacher', 'teacherSlot'],
                status: { $in: [2] },
            };
        } else {
            data = {
                instituteBatch: id,
                $populate: ['teacher', 'teacherSlot'],
                status: { $in: [4] },
            };
        }
        allAttendanceService
            .find({
                query: {
                    ...data,
                },
            })
            .then((response) => {
                setAttendanceData(response);
                setLoading(false);
            })
            .catch((error) => {
                handleError()(error);
                // setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            });
        // }
    }, [typeOfLiveClass]);

    return (
        <React.Fragment>
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant={'h3'}>
                            <Translate root={'batch-details/[batchDetailsById]'}>{'title'}</Translate>
                        </Typography>
                        <FormControl margin="dense" variant="outlined">
                            <Select
                                input={<BootstrapInput />}
                                onChange={(e) => {
                                    setTypeOfLiveClass(e.target.value);
                                    setAttendanceData([]);
                                    setLoading(true);
                                }}
                                value={typeOfLiveClass}
                            >
                                <MenuItem value={1}>
                                    <Translate root={'batch-details/[batchDetailsById]'}>{'All'}</Translate>
                                </MenuItem>
                                {liveClassType &&
                                    liveClassType.map((each) => (
                                        <MenuItem key={each?.Type} value={each?.value}>
                                            {each?.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                {/*<Grid item md={12} sm={12} xs={12}>*/}
                {/*    <Hidden smUp>*/}
                {/*        <Box mt={2} />*/}
                {/*        <Button*/}
                {/*            color="primary"*/}
                {/*            disabled={loading}*/}
                {/*            fullWidth*/}
                {/*            // onClick={handleButtonOpen}*/}
                {/*            size="medium"*/}
                {/*            variant="contained"*/}
                {/*        >*/}
                {/*            <Translate root={'institute-attendance/[id]'}>{'button'}</Translate>*/}
                {/*        </Button>*/}
                {/*    </Hidden>*/}
                {/*</Grid>*/}
            </Grid>
            {attendanceData.length ? (
                <div className={classes.mainDiv}>
                    <Grid container spacing={2}>
                        {attendanceData.map((each, index) => {
                            return (
                                <CardForAttendance
                                    allStudentsInTheClass={id}
                                    attendanceData={attendanceData}
                                    each={each}
                                    key={each._id}
                                    position={index}
                                    setAttendanceData={setAttendanceData}
                                />
                            );
                        })}
                    </Grid>
                </div>
            ) : loading ? (
                <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                    <LiveClassSkeleton />
                </Box>
            ) : (
                <Translate root={'batch-details/[batchDetailsById]'}>{'noSchedule'}</Translate>
            )}
        </React.Fragment>
    );
};

export default Attendance;
