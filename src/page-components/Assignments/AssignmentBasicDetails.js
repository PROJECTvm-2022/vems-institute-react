import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '../../components/DialogTitle';
import Skeleton from '@material-ui/lab/Skeleton';

// eslint-disable-next-line react/prop-types
const AssignmentBasicDetails = ({ assignmentData, loading }) => {
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <Paper component={Box} p={2}>
                <Box mb={4}>
                    <Typography variant={'h3'}>{'Assignment details'}</Typography>
                </Box>
                {loading ? (
                    <Grid container spacing={2}>
                        {new Array(10).fill(8).map(() => (
                            <>
                                <Grid item md={2} sm={6} xs={12}>
                                    <Skeleton />
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <Skeleton />
                                </Grid>
                            </>
                        ))}
                    </Grid>
                ) : (
                    <Grid container spacing={2}>
                        <Grid item md={2} sm={6} xs={12}>
                            <Typography color={'textSecondary'} variant={'body2'}>
                                {'Title'}
                            </Typography>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            {assignmentData?.title}
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <Typography color={'textSecondary'} variant={'body2'}>
                                {'Subect'}
                            </Typography>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            {assignmentData?.subject?.name + ' (' + assignmentData?.course?.name + ')'}
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <Typography color={'textSecondary'} variant={'body2'}>
                                {'Description'}
                            </Typography>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            {assignmentData?.description}
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <Typography color={'textSecondary'} variant={'body2'}>
                                {'Created On'}
                            </Typography>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            {assignmentData?.createdAt
                                ? moment(assignmentData?.createdAt).utc(false).format('MMMM Do YYYY, h:mm a')
                                : '---'}
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <Typography color={'textSecondary'} variant={'body2'}>
                                {'Dead Line'}
                            </Typography>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            {assignmentData?.deadLine
                                ? moment(assignmentData?.deadLine).utc(false).format('MMMM Do YYYY, h:mm a')
                                : '---'}
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <Typography color={'textSecondary'} variant={'body2'}>
                                {'Total Submissions'}
                            </Typography>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            {'34 / 56' + ' To be done at API'}
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <Typography color={'textSecondary'} variant={'body2'}>
                                {'Total Mark'}
                            </Typography>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            {assignmentData?.totalMark + ' marks'}
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <Typography color={'textSecondary'} variant={'body2'}>
                                {'Question'}
                            </Typography>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <Chip
                                color={'primary'}
                                label={'View question'}
                                onClick={() => {
                                    setOpen(true);
                                }}
                                size={'small'}
                                variant={'contained'}
                            />
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <Typography color={'textSecondary'} variant={'body2'}>
                                {'Status'}
                            </Typography>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            {assignmentData?.status === 1 && <Chip color={'primary'} label={'Draft'} size={'small'} />}
                            {assignmentData?.status === 2 && (
                                <Chip label={'Scheduled'} size={'small'} style={{ background: '#ffe500' }} />
                            )}
                            {assignmentData?.status === 4 && (
                                <Chip label={'Completed'} size={'small'} style={{ background: '#12ff00' }} />
                            )}
                            {assignmentData?.status === 5 && (
                                <Chip color={'secondary'} label={'Canceled'} size={'small'} />
                            )}
                        </Grid>
                        {assignmentData?.status === 2 && (
                            <>
                                <Grid item md={2} sm={6} xs={12}>
                                    <Typography color={'textSecondary'} variant={'body2'}>
                                        {'Submission'}
                                    </Typography>
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    {assignmentData?.deadLine
                                        ? moment(assignmentData?.deadLine).endOf('day').fromNow()
                                        : '---'}
                                </Grid>
                            </>
                        )}
                    </Grid>
                )}
            </Paper>
            <Dialog
                maxWidth={'lg'}
                onClose={() => {
                    setOpen(false);
                }}
                open={open}
            >
                <DialogTitle
                    onClose={() => {
                        setOpen(false);
                    }}
                >
                    {'Question of the assignment'}
                </DialogTitle>
                <DialogContent>
                    {assignmentData?.questions?.map((each) => (
                        <img
                            alt={`${assignmentData?.title}`}
                            src={each?.link}
                            style={{ width: '100%', height: 'auto' }}
                        />
                    ))}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

AssignmentBasicDetails.propType = {
    assignmentData: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default AssignmentBasicDetails;
