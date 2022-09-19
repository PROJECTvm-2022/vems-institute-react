import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { Divider, Typography } from '@material-ui/core/index';
import Translate from '../../components/Translate';
import { useStudentDetailsData } from '../../store/StudentDetailsContext';
import { array } from 'prop-types';

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
        flexWrap: 'wrap',
        padding: theme.spacing(1),
    },
    rootCard: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1),
        marginBottom: 10,
    },
    headerTypo: {
        color: theme.palette.common.white,
    },
    chip: {
        // color: theme.palette.common.black,
        margin: theme.spacing(0, 1, 1, 0),
    },
}));

export default function DetailsLeftProfile({ setSubjects, subjects, setStudentProfileData, studentProfileData }) {
    const [data] = useStudentDetailsData();
    const classes = useStyles();

    return (
        <>
            <Paper className={classes.rootCard}>
                <div className={classes.headerCard}>
                    <Typography className={classes.headerTypo} variant={'h4'}>
                        <Translate root={'students/[id]'}>{'details.studyDetails'}</Translate>
                    </Typography>
                    <Box mt={4} />
                </div>
                <div className={classes.contentCard}>
                    <Typography variant={'caption'}>
                        <Translate root={'students/[id]'}>{'details.instName'}</Translate>
                    </Typography>
                    <Typography variant={'h6'}>{data && data?.institute?.name}</Typography>
                </div>
                <Divider />
                <div className={classes.contentCard}>
                    <Typography variant={'caption'}>
                        <Translate root={'students/[id]'}>{'details.courses'}</Translate>
                    </Typography>
                    {/*{subjects?.map((each) => (*/}
                    {/*    <>*/}
                    <Box p={1}>
                        <Typography variant={'h6'}>{subjects && subjects[0]?.course?.name}</Typography>
                    </Box>
                    {/*</>*/}
                    {/*))}*/}
                </div>
                <Divider />
                <div className={classes.contentCard}>
                    <Typography variant={'caption'}>
                        <Translate root={'students/[id]'}>{'details.subjects'}</Translate>
                    </Typography>
                    {subjects?.map((each) => (
                        <>
                            <Box p={1}>
                                <Typography variant={'h6'}>{subjects && each?.subject?.name}</Typography>
                            </Box>
                        </>
                    ))}
                </div>
                <Divider />
                <div className={classes.contentCard}>
                    <Typography variant={'caption'}>
                        <Translate root={'students/[id]'}>{'details.batch'}</Translate>
                    </Typography>
                    <Typography variant={'h6'}>
                        {studentProfileData && studentProfileData?.instituteBatch?.name}
                    </Typography>
                </div>
            </Paper>
            <Paper className={classes.rootCard}>
                <div className={classes.headerCard}>
                    <Typography className={classes.headerTypo} variant={'h4'}>
                        <Translate root={'students/[id]'}>{'details.contactDetails'}</Translate>
                    </Typography>
                    <Box mt={4} />
                </div>
                <div className={classes.contentCard}>
                    <Typography variant={'caption'}>
                        <Translate root={'students/[id]'}>{'details.number'}</Translate>
                    </Typography>
                    <Typography variant={'h6'}>{data && data.phone}</Typography>
                </div>
                <Divider />
                <div className={classes.contentCard}>
                    <Typography variant={'caption'}>
                        <Translate root={'students/[id]'}>{'details.email'}</Translate>
                    </Typography>
                    <Typography variant={'h6'}>{data && data.email}</Typography>
                </div>
                <Divider />
                <div className={classes.contentCard}>
                    <Typography variant={'caption'}>
                        <Translate root={'students/[id]'}>{'details.address'}</Translate>
                    </Typography>
                    <Typography variant={'h6'}>{data && data.address}</Typography>
                </div>
            </Paper>
        </>
    );
}
