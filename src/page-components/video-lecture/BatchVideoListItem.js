import Link from '../../components/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import style from '../../assets/styles/common.module.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '../../components/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { InstituteBatchVideoService } from '../../apis/rest.app';
import moment from 'moment';

const BatchVideoListItem = ({ video }) => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [scheduledOn, setScheduledOn] = useState(video.scheduledOn || new Date());
    const [savedScheduledOn, setSavedScheduledOn] = useState(video.scheduledOn || new Date());
    const [isScheduled, setIsScheduled] = useState(video.status);
    const [saving, setCreating] = useState(false);

    const handleSave = () => {
        setCreating(true);
        InstituteBatchVideoService.patch(video._id, {
            status: 2,
            scheduledOn,
        })
            .then(() => {
                setIsScheduled(2);
                setSavedScheduledOn(scheduledOn);
                setCreateModalOpen(false);
            })
            .finally(() => setCreating(false));
    };

    const handleUnSchedule = () => {
        setCreating(true);
        InstituteBatchVideoService.patch(video._id, {
            status: 3,
        })
            .then(() => {
                setIsScheduled(3);
                // setSavedScheduledOn(scheduledOn);
                setCreateModalOpen(false);
            })
            .finally(() => setCreating(false));
    };

    return (
        <Grid
            // as={`/video-lecture/details/${video.videoId._id}`}
            // component={Link}
            href="/video-lecture/details/[videoId]"
            item
            key={video._id}
            lg={2}
            md={3}
            sm={3}
            xs={12}
        >
            {/*{loadingThumbnail && <Skeleton className={classes.subjectCard} variant="rect" />}*/}
            <Link href={`/video-lecture/details/${video?.videoId?._id}?videoObjId=${video?._id}`}>
                <Box
                    alt={video.title}
                    component="img"
                    maxWidth="100%"
                    mb={1}
                    // onLoad={() => {
                    //     setLoadingThumbnail(false);
                    // }}
                    src={video.thumbnail}
                />
            </Link>
            <Typography className={style.ellipsis} color="textPrimary" variant="h4">
                {video.videoId.title}
            </Typography>

            {isScheduled === 2 && (
                <Typography color="textSecondary" variant="subtitle2">
                    {'Scheduled On: '}
                    {moment(savedScheduledOn).format('YYYY-MM-DD hh:mm A')}
                </Typography>
            )}

            {isScheduled === 2 && (
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Button
                            color="primary"
                            // disabled={isScheduled}
                            fullWidth
                            onClick={() => setCreateModalOpen(true)}
                            size="small"
                            variant="contained"
                        >
                            {/*{!isScheduled ? 'Schedule' : 'Scheduled'}*/}
                            {'Change Date'}
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            color="secondary"
                            // disabled={isScheduled}
                            fullWidth
                            onClick={handleUnSchedule}
                            size="small"
                            variant="contained"
                        >
                            {/*{!isScheduled ? 'Schedule' : 'Scheduled'}*/}
                            {'Un Schedule'}
                        </Button>
                    </Grid>
                </Grid>
            )}
            {isScheduled === 3 && (
                <Box mt={1}>
                    <Button
                        color="primary"
                        fullWidth
                        onClick={() => setCreateModalOpen(true)}
                        size="small"
                        variant="contained"
                    >
                        {'Schedule'}
                    </Button>
                </Box>
            )}

            <Dialog fullWidth maxWidth={'xs'} onClose={() => setCreateModalOpen(false)} open={createModalOpen}>
                <DialogTitle onClose={() => setCreateModalOpen(false)}>Schedule Video</DialogTitle>
                <DialogContent>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <Box display={'flex'} flexDirection={'column'} pb={1}>
                            <DateTimePicker
                                inputVariant="outlined"
                                label="Choose Date and Time"
                                onChange={setScheduledOn}
                                value={scheduledOn}
                            />
                        </Box>
                        <Box mb={2} />
                        <Button
                            color={'primary'}
                            disabled={saving}
                            fullWidth
                            onClick={handleSave}
                            size="small"
                            variant={'contained'}
                        >
                            {saving ? <CircularProgress size={22} /> : 'Save'}
                        </Button>
                    </MuiPickersUtilsProvider>
                </DialogContent>
            </Dialog>
        </Grid>
    );
};

BatchVideoListItem.propTypes = {
    video: PropTypes.object.isRequired,
};

export default BatchVideoListItem;
