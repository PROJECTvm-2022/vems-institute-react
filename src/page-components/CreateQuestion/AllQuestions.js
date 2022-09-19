/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description
 * @createdOn 06/04/21 12:50 AM
 */

import React, { useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Confirm from '../../components/Confirm';
import { QuestionsService } from '../../apis/rest.app';
import useHandleError from '../../hooks/useHandleError';
import QuestionSkeleton from '../../components/Skeleton/QuestionSkeleton';
import QuestionEditDialogForDetailsPage from '../Exam-details/QuestionEditDialogForDetailsPage';
import { useSnackbar } from 'notistack';
import QuillViewer from '../../components/QuillComponents/QuillViewer ';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const GreenRadio = withStyles((theme) => ({
    root: {
        color: theme.palette.success.main,
        '&$checked': {
            color: theme.palette.success.main,
        },
    },
    checked: {},
}))((props) => <Radio color="default" {...props} />);

const useStyle = makeStyles((theme) => ({
    activeOption: {
        border: '2px solid #EFEFEF',
        background:'#fff',
        borderRadius: '5px',
        width: '100%',
    },
    inActiveOption: {
        border: `1px solid #E6E7EF`,
        background: '#F3F3F3',
        borderRadius: '5px',
        width: '100%',
    },
}));

const AllQuestionsSection = ({
    id,
    allQuestions,
    setAllQuestions,
    allQuestionsLoading,
}) => {
    const classes = useStyle();
    const [openDialog, setOpenDialog] = useState(false);
    const [examDetails, setExamDetails] = useState(null);
    const [index, setIndex] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    const handleOpenDialog = (each, index) => {
        setExamDetails(each);
        setIndex(index);
        setOpenDialog(true);
    };

    const handleError = useHandleError();

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
                <Grid item md={12} sm={12} xs={12}>
                    {allQuestions?.length ? (
                        allQuestions.map((each, index) => (
                            <React.Fragment key={each._id}>
                                <Grid item md={12} sm={12} xs={12}>
                                    <Box display={'flex'} justifyContent={'space-between'}>
                                        <Box alignSelf={'center'} display={'flex'}>
                                            <QuillViewer html={`Q.${allQuestions?.length -index} : ${each.question}`} />
                                            {/*<Typography variant="h4">{`Q.${index + 1} : ${each.question}`}</Typography>*/}
                                        </Box>
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
                                                                    className={classes.activeOption}
                                                                    style={{ width: '100%' }}
                                                                >
                                                                    <Accordion>
                                                                        <AccordionSummary
                                                                            aria-controls="panel1a-content"
                                                                            expandIcon={<ExpandMoreIcon />}
                                                                            id="panel1a-header"
                                                                        >
                                                                            <Typography className={classes.heading}>
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
                                                                    className={classes.inActiveOption}
                                                                    style={{ width: '100%' }}
                                                                >
                                                                    <Accordion>
                                                                        <AccordionSummary
                                                                            aria-controls="panel1a-content"
                                                                            expandIcon={<ExpandMoreIcon />}
                                                                            id="panel1a-header"
                                                                        >
                                                                            <Typography className={classes.heading}>
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
                                            <div className={classes.inActiveOption} style={{ width: '100%' }}>
                                                <Accordion>
                                                    <AccordionSummary
                                                        aria-controls="panel1a-content"
                                                        expandIcon={<ExpandMoreIcon />}
                                                        id="panel1a-header"
                                                    >
                                                        <Typography className={classes.heading}>{`Answer`}</Typography>
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
                                            {/*    <Typography*/}
                                            {/*        className={classes.activeText}*/}
                                            {/*        variant={'body2'}*/}
                                            {/*        width={'100%'}*/}
                                            {/*    >*/}
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
            </Grid>
            <QuestionEditDialogForDetailsPage
                allQuestions={allQuestions}
                examDetails={examDetails}
                id={id}
                index={index}
                openDialog={openDialog}
                setAllQuestions={setAllQuestions}
                setOpenDialog={setOpenDialog}
            />
        </React.Fragment>
    );
};

export default AllQuestionsSection;
