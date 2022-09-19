/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description
 * @createdOn 06/04/21 12:05 AM
 */

import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ExamMoreDetails from '../../src/page-components/Exam-details/ExamMoreDetails';
import { useRouter } from 'next/router';
import { ExamService } from '../../src/apis/rest.app';
import useHandleError from '../../src/hooks/useHandleError';
import Button from '@material-ui/core/Button';
import ExamDetailsSkeleton from '../../src/components/Skeleton/ExamDetailsSkeleton';
// import ExamAddDialog from '../../src/page-components/exam/ExamAddDialog';
import ExamEditDialog from '../../src/page-components/Exam-details/ExamEditDialog';
import { withExamCreateData } from '../../src/store/ExamCreateContext';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '../../src/components/DialogTitle';
import Translate from '../../src/components/Translate';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';
import moment from 'moment';

const useStyle = makeStyles((theme) => ({
    main: {
        padding: 24,
    },
    gradeDiv: {
        width: '84px',
        height: '30px',
        borderRadius: '5px',
        color: '#fff',
    },
}));

const Index = () => {
    const classes = useStyle();
    const Router = useRouter();
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();

    const { id: examId } = Router.query;
    const [loading, setLoading] = useState(false);

    const [examDetails, setExamDetails] = useState(null);
    const [publishDate, setPublishDate] = useState();
    const [examDetailsLoading, setExamDetailsLoading] = useState(false);
    const [published, setPublished] = useState(false);

    useEffect(() => {
        if (!examId) return;
        setExamDetailsLoading(true);
        ExamService.get(examId, {
            query: {
                $populate: ['subject', 'syllabus', 'course'],
            },
        })
            .then((res) => {
                console.log('response...---', res);
                setExamDetails(res);
                setPublishDate(moment(res?.resultPublishDate).format('yyyy-MM-DDThh:mm'));
                setExamDetailsLoading(false);
            })
            .catch((error) => {
                setExamDetailsLoading(false);
                handleError()(error);
            });
    }, [examId]);

    const gradeColor = ['#373737', '#003760', '#35931D', '#938E1D', '#FFB800', '#FC8415', '#C73414'];

    const [tableOpen, setTableOpen] = useState(false);
    const [publishDialogOpen, setPublishDialogOpen] = useState(false);

    const ClosepublishDialogOpen = () => {
        setPublishDialogOpen(false);
    };

    const publishResult = (resultPublishDate) => {
        setLoading(true);
        ExamService.patch(examId, {
            resultPublishDate,
            status: resultPublishDate ? undefined : 6,
        })

            .then((res) => {
                setLoading(false);
                setExamDetails(res);
                // console.log('res',res);
                enqueueSnackbar('Published Result Successfully..', { variant: 'success' });
                setPublishDialogOpen(false);
            })
            .catch((err) => {
                // console.log('err',err)
                handleError(err);
                setLoading(false);
            });
    };
    return (
        <React.Fragment>
            <Card className={classes.main}>
                {examDetails && !examDetailsLoading ? (
                    <Grid container spacing={1}>
                        <Grid item md={12} sm={12} xs={12}>
                            <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
                                <Typography variant={'h4'}>{examDetails?.title}</Typography>
                                {(examDetails.status === 4 || examDetails.status === 6) && (
                                    <Button
                                        color={'primary'}
                                        disabled={examDetails?.status !== 4}
                                        onClick={() => {
                                            setPublishDialogOpen(true);
                                        }}
                                        size={'small'}
                                        variant={'contained'}
                                    >
                                        {examDetails?.status !== 4 ? 'Result Published' : 'Publish Result'}
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                        {/*<Grid item md={6} sm={6} xs={12}>*/}
                        {/*<Box display={'flex'} justifyContent={'flex-end'} onClick={handleButtonOpen}>*/}
                        {/*    <Button color={'primary'} variant={'outlined'}>*/}
                        {/*        {'Edit'}*/}
                        {/*    </Button>*/}
                        {/*</Box>*/}
                        {/*</Grid>*/}
                        {/*<Grid item md={6} sm={6} xs={12}>*/}
                        {/*    <Box display={'flex'}>*/}
                        {/*        <Typography color="textSecondary" variant={'h5'}>*/}
                        {/*            {examDetails?.course?.name}*/}
                        {/*        </Typography>*/}
                        {/*        <Box ml={1} />*/}
                        {/*        {'·'}*/}
                        {/*        <Box ml={1} />*/}
                        {/*        <Typography color="textSecondary" variant={'h5'}>*/}
                        {/*            {examDetails?.subject?.name}*/}
                        {/*        </Typography>*/}
                        {/*        <Box ml={1} />*/}
                        {/*        {'·'}*/}
                        {/*        <Box ml={1} />*/}
                        {/*        <Typography color="textSecondary" variant={'h5'}>*/}
                        {/*            {'Mixed type questions'}*/}
                        {/*        </Typography>*/}
                        {/*    </Box>*/}
                        {/*</Grid>*/}
                        <Grid item md={12} sm={12} xs={12}>
                            <Box display="flex">
                                <Box alignSelf={'center'} height={'100%'} mr={2} width={'60px'}>
                                    <Typography color="textSecondary" variant="body2">
                                        {'Grade :'}
                                    </Typography>
                                </Box>
                                <Box display={'flex'} flexWrap={'wrap'}>
                                    {examDetails && examDetails.mark && examDetails.mark.grades.length ? (
                                        examDetails.mark.grades.map((each, index) => (
                                            <Box
                                                alignItems={'center'}
                                                className={classes.gradeDiv}
                                                display={'flex'}
                                                justifyContent={'center'}
                                                key={each._id}
                                                mb={1}
                                                mt={1}
                                                mx={1}
                                                style={{ background: `${gradeColor[index]}` }}
                                            >
                                                {each.name}
                                                {' = '}
                                                {each.mark}
                                                {'%'}
                                            </Box>
                                        ))
                                    ) : !examDetailsLoading ? (
                                        <Box display={'flex'}>
                                            <Typography variant={'h5'}>{'No Grades added'}</Typography>
                                        </Box>
                                    ) : (
                                        ''
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Box display="flex">
                                <Box alignSelf={'center'} height={'100%'} mr={2}>
                                    <Typography color="textSecondary" variant="body2">
                                        {'Description: :'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Box display="flex">
                                <Box alignSelf={'center'} height={'100%'} mr={2}>
                                    <Typography variant="body2">{examDetails?.description}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                ) : (
                    <ExamDetailsSkeleton />
                )}
            </Card>
            <Box mt={2} />
            <ExamMoreDetails examDetails={examDetails} id={examId} />
            <ExamEditDialog
                each={examDetails}
                setExamDetails={setExamDetails}
                setTableOpen={setTableOpen}
                tableOpen={tableOpen}
            />
            <Dialog
                fullWidth
                maxWidth={'sm'}
                onClose={() => {
                    ClosepublishDialogOpen();
                }}
                open={publishDialogOpen}
            >
                <DialogTitle
                    onClose={() => {
                        ClosepublishDialogOpen();
                    }}
                >
                    <Translate root={'all-exams'}>{'Result Publish Date'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} width={'100%'}>
                        <TextField
                            InputLabelProps={{
                                shrink: true,
                            }}
                            className={classes.textField}
                            defaultValue={publishDate}
                            id="datetime-local"
                            label="Date and time"
                            onChange={(e) => setPublishDate(e.target.value)}
                            size={'small'}
                            style={{ width: '75%' }}
                            type="datetime-local"
                            value={publishDate}
                            variant={'outlined'}
                        />
                        <Box mr={1} />
                        <Button
                            color={'primary'}
                            onClick={() => {
                                // setPublished(true);
                                // console.log('date',_date);
                                publishResult();
                            }}
                            variant={'outlined'}
                        >
                            {'Publish Now'}
                        </Button>
                    </Box>
                    <Box mt={2} />
                    <>
                        <Box mb={2} />
                        <Button
                            color={'primary'}
                            fullWidth
                            // disabled={}
                            onClick={() => {
                                // let _date = null;
                                publishResult(publishDate);
                            }}
                            variant={'contained'}
                        >
                            {loading ? (
                                <CircularProgress size={20} />
                            ) : (
                                <Translate root={'all-exams'}>{'Publish Result'}</Translate>
                            )}
                        </Button>
                        <Box mb={2} />
                    </>
                    {/*)}*/}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

export default withExamCreateData(Index);
