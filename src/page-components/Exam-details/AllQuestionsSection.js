/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description
 * @createdOn 06/04/21 12:50 AM
 */

import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useRouter } from 'next/router';
import useHandleError from '../../hooks/useHandleError';
import { ExamService, QuestionService, QuestionsService } from '../../apis/rest.app';
import QuestionSkeleton from '../../components/Skeleton/QuestionSkeleton';
import QuestionEditDialogForDetailsPage from './QuestionEditDialogForDetailsPage';
import Link from '../../components/Link';
import Confirm from '../../components/Confirm';
import { useSnackbar } from 'notistack';
import QuillViewer from '../../components/QuillComponents/QuillViewer ';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const GreenRadio = withStyles((theme) => ({
    root: {
        color: theme?.palette?.success?.main,
        '&$checked': {
            color: theme?.palette?.success?.main,
        },
    },
    checked: {},
}))((props) => <Radio color="default" {...props} />);

// const useStyle = makeStyles((theme) => ({
//     activeOption: {
//         border: `1px solid ${theme?.palette?.success?.light}`,
//         background: '#DEFFE1',
//         borderRadius: '5px',
//         width: '100%',
//     },
//     inActiveOption: {
//         border: `1px solid rgba(0, 0, 0, 0.12)`,
//         background: '#F3F3F3',
//         borderRadius: '5px',
//         width: '100%',
//     },
//     activeText: {
//         color: theme?.palette?.success?.dark,
//     },
// }));

const AllQuestionsSection = ( ) => {
    const Router = useRouter();
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();

    const { id, scheduleExamId } = Router.query;

    const examId = scheduleExamId ?? id;

    const [allQuestions, setAllQuestions] = useState([]);
    const [allQuestionsLoading, setAllQuestionsLoading] = useState(false);

    const [examDetails, setExamDetails] = useState(null);
    const [questionDetails, setQuestionDetails] = useState(null);
    const [examDetailsLoading, setExamDetailsLoading] = useState(false);

    // console.log('examDetails=======================>dd',examDetails);

    useEffect(async () => {
        let _entityId;
        if (!examId) return;
        setExamDetailsLoading(true);
        await ExamService.get(examId, {
            query: {
                $populate: ['subject', 'syllabus', 'course'],
            },
        })
            .then((res) => {
                setExamDetails(res);
                if (res.status === 1) {
                    _entityId = examId;
                } else {
                    _entityId = res.entityId;
                }
                setExamDetailsLoading(false);
            })
            .catch((error) => {
                setExamDetailsLoading(false);
                handleError()(error);
            });
        if (!_entityId) return;
        setAllQuestionsLoading(true);
        await QuestionService.find({
            query: {
                entityId: _entityId,
            },
        })
            .then((res) => {
                setAllQuestions([...res]);
                setAllQuestionsLoading(false);
            })
            .catch((error) => {
                setAllQuestionsLoading(false);
                handleError()(error);
            });
    }, [examId]);
    const [openDialog, setOpenDialog] = useState(false);
    const [index, setIndex] = useState('');

    const handleOpenDialog = (each, index) => {
        setQuestionDetails(each);
        setIndex(index);
        setOpenDialog(true);
    };

    const deleteQuestion = (each, index) => {
        Confirm('Are you sure', 'Do you really wants to delete this', 'yes').then(() => {
            QuestionsService.remove(each._id)
                .then(() => {
                    let _allQuestions = allQuestions;
                    setAllQuestions([]);
                    _allQuestions.splice(index, 1);
                    setAllQuestions([..._allQuestions]);
                    enqueueSnackbar('Deleted Successfully', {
                        variant: 'success',
                    });
                })
                .catch((error) => {
                    handleError()(error);
                });
        });
    };

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                {examDetails?.status === 1 && (
                    <Grid item md={12} sm={12} xs={12}>
                        <Box display={'flex'} justifyContent={'flex-end'}>
                            <Button
                                color={'primary'}
                                component={Link}
                                href={`/create-questions/${examId}`}
                                variant={'outlined'}
                            >
                                {'Add Questions to Exam '}
                            </Button>
                        </Box>
                    </Grid>
                )}

                {allQuestions.length ? (
                    allQuestions.map((each, index) => (
                        <React.Fragment key={each._id}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Box display={'flex'} justifyContent={'space-between'}>
                                    <Box alignSelf={'center'} display={'flex'}>
                                        <QuillViewer html={`Q.${index + 1} : ${each.question}`} />
                                        {/*<Typography variant="h4">{`Q.${index + 1} : ${each.question}`}</Typography>*/}
                                    </Box>
                                    {examDetails?.status === 1 && (
                                        <div>
                                            <Button
                                                color={'secondary'}
                                                onClick={() => {
                                                    deleteQuestion(each, index);
                                                }}
                                            >
                                                <DeleteIcon />
                                                <Box ml={1} />
                                                {'Delete'}
                                            </Button>
                                            <Button
                                                color={'primary'}
                                                onClick={() => {
                                                    handleOpenDialog(each, index);
                                                }}
                                            >
                                                <EditIcon />
                                                <Box ml={1} />
                                                {'Edit'}
                                            </Button>
                                        </div>
                                    )}
                                </Box>
                            </Grid>
                            {each?.answerType === 1 ? (
                                <Grid item md={12} sm={12} xs={12}>
                                    <Box display={'flex'} flexDirection={'column'}>
                                        {each?.choices.length &&
                                            each?.choices.map((item, position) => (
                                                <div key={item}>
                                                    {each?.answer?.answerOfQuestion[0] === item ? (
                                                        <Box display={'flex'} my={0.8}>
                                                            <Box display={'flex'} ml={-1} pr={1}>
                                                                <GreenRadio checked={true} />
                                                            </Box>
                                                            <div
                                                                style={{
                                                                    width: '100%',
                                                                    border: `1px solid`,
                                                                    background: '#DEFFE1',
                                                                    borderRadius: '5px',
                                                                }}
                                                            >
                                                                <Accordion>
                                                                    <AccordionSummary
                                                                        aria-controls="panel1a-content"
                                                                        expandIcon={<ExpandMoreIcon />}
                                                                        id="panel1a-header"
                                                                    >
                                                                        <Typography>
                                                                            {`Choice ${position + 1}`}
                                                                        </Typography>
                                                                    </AccordionSummary>
                                                                    <AccordionDetails>
                                                                        <QuillViewer html={item} />
                                                                    </AccordionDetails>
                                                                </Accordion>
                                                            </div>
                                                            {/*<Box*/}
                                                            {/*    alignItems={'center'}*/}
                                                            {/*    className={classes.activeOption}*/}
                                                            {/*    display={'flex'}*/}
                                                            {/*    p={1}*/}
                                                            {/*    px={2}*/}
                                                            {/*>*/}
                                                            {/*    <Typography*/}
                                                            {/*        className={classes.activeText}*/}
                                                            {/*        variant={'body2'}*/}
                                                            {/*        width={'100%'}*/}
                                                            {/*    >*/}
                                                            {/*        {item}*/}
                                                            {/*    </Typography>*/}
                                                            {/*</Box>*/}
                                                        </Box>
                                                    ) : (
                                                        <Box display={'flex'} my={0.8}>
                                                            <Box display={'flex'} ml={-1} pr={1}>
                                                                <GreenRadio color="primary" disabled />
                                                            </Box>
                                                            <div
                                                                style={{
                                                                    border: `1px solid rgba(0, 0, 0, 0.12)`,
                                                                    background: '#F3F3F3',
                                                                    borderRadius: '5px',
                                                                    width: '100%',
                                                                }}
                                                            >
                                                                <Accordion>
                                                                    <AccordionSummary
                                                                        aria-controls="panel1a-content"
                                                                        expandIcon={<ExpandMoreIcon />}
                                                                        id="panel1a-header"
                                                                    >
                                                                        <Typography>
                                                                            {`Choice ${position + 1}`}
                                                                        </Typography>
                                                                    </AccordionSummary>
                                                                    <AccordionDetails>
                                                                        <QuillViewer html={item} />
                                                                    </AccordionDetails>
                                                                </Accordion>
                                                            </div>
                                                            {/*<Box*/}
                                                            {/*    alignItems={'center'}*/}
                                                            {/*    className={classes.inActiveOption}*/}
                                                            {/*    display={'flex'}*/}
                                                            {/*    p={1}*/}
                                                            {/*    px={2}*/}
                                                            {/*>*/}
                                                            {/*    <Typography*/}
                                                            {/*        color="textSecondary"*/}
                                                            {/*        variant={'body2'}*/}
                                                            {/*        width={'100%'}*/}
                                                            {/*    >*/}
                                                            {/*        {item}*/}
                                                            {/*    </Typography>*/}
                                                            {/*</Box>*/}
                                                        </Box>
                                                    )}
                                                </div>
                                            ))}
                                    </Box>
                                </Grid>
                            ) : (
                                <Box display={'flex'} flexDirection={'column'} ml={1} pt={1} width={'100%'}>
                                    <Typography variant={'body2'}>{'Right Answer :-'}</Typography>
                                    <Box display={'flex'} my={0.8} width={'100%'}>
                                        <div
                                            style={{
                                                border: `1px solid rgba(0, 0, 0, 0.12)`,
                                                background: '#F3F3F3',
                                                borderRadius: '5px',
                                                width: '100%',
                                            }}
                                        >
                                            <Accordion>
                                                <AccordionSummary
                                                    aria-controls="panel1a-content"
                                                    expandIcon={<ExpandMoreIcon />}
                                                    id="panel1a-header"
                                                >
                                                    <Typography>{`Answer`}</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <QuillViewer html={each?.answer?.answerOfQuestion[0]} />
                                                </AccordionDetails>
                                            </Accordion>
                                        </div>
                                        {/*<Box*/}
                                        {/*    alignItems={'center'}*/}
                                        {/*    className={classes.activeOption}*/}
                                        {/*    display={'flex'}*/}
                                        {/*    p={1}*/}
                                        {/*    px={2}*/}
                                        {/*    width={'100%'}*/}
                                        {/*>*/}
                                        {/*    <Typography className={classes.activeText} variant={'body2'} width={'100%'}>*/}
                                        {/*        {each?.answer?.answerOfQuestion[0]}*/}
                                        {/*    </Typography>*/}
                                        {/*</Box>*/}
                                    </Box>
                                </Box>
                            )}
                        </React.Fragment>
                    ))
                ) : !allQuestionsLoading ? (
                    <Box display={'flex'} justifyContent={'center'} m={3} width={'100%'}>
                        <Typography variant={'h2'}>{'No Questions Added'}</Typography>
                    </Box>
                ) : (
                    <QuestionSkeleton />
                )}
            </Grid>
            <QuestionEditDialogForDetailsPage
                allQuestions={allQuestions}
                examDetails={questionDetails}
                id={id}
                index={index}
                openDialog={openDialog}
                setAllQuestions={setAllQuestions}
                setExamDetails={setQuestionDetails}
                setOpenDialog={setOpenDialog}
            />
        </React.Fragment>
    );
};

export default AllQuestionsSection;
