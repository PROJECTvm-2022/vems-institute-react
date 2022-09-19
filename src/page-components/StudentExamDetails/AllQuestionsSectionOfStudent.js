/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description
 * @createdOn 06/04/21 12:50 AM
 */

import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import withStyles from '@material-ui/core/styles/withStyles';
// import { useRouter } from 'next/router';
import QuestionSkeleton from '../../components/Skeleton/QuestionSkeleton';
import QuillViewer from '../../components/QuillComponents/QuillViewer ';
import { Accordion, AccordionDetails } from '@material-ui/core/index';
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

const useStyle = makeStyles((theme) => ({
    activeOption: {
        border: `1px solid ${theme?.palette?.success?.light}`,
        background: '#DEFFE1',
        borderRadius: '5px',
        width: '100%',
    },
    activeOption2: {
        border: `1px solid ${theme?.palette?.success?.light}`,
        background: '#FFE3E0',
        borderRadius: '5px',
        width: '100%',
    },
    activeOption3: {
        border: `1px solid ${theme?.palette?.success?.light}`,
        background: '#FFA500',
        borderRadius: '5px',
        width: '100%',
    },
    //#FFA500
    inActiveOption: {
        border: `1px solid rgba(0, 0, 0, 0.12)`,
        background: '#F3F3F3',
        borderRadius: '5px',
        width: '100%',
    },
    activeText: {
        color: theme?.palette?.success?.dark,
    },
}));

const AllQuestionsSectionOfStudent = ({ studentDetails }) => {
    const classes = useStyle();

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                {studentDetails?.answers?.length ? (
                    studentDetails?.answers?.map((each, index) => (
                        <React.Fragment key={each._id}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Box display={'flex'} justifyContent={'space-between'}>
                                    <Box alignSelf={'center'} display={'flex'}>
                                        <QuillViewer html={`Q.${index + 1} : ${each?.question?.question}`} />
                                        {/*<Typography variant="h4">{`Q.${index + 1} : ${*/}
                                        {/*    each?.question?.question*/}
                                        {/*}`}</Typography>*/}
                                    </Box>
                                </Box>
                            </Grid>
                            {each?.question?.answerType === 1 ? (
                                <Grid item md={12} sm={12} xs={12}>
                                    {
                                        <Box display={'flex'} flexDirection={'column'}>
                                            {each?.question?.choices.map((item, position) => (
                                                <div key={item}>
                                                    {
                                                        <Box
                                                            display={'flex'}
                                                            my={0.8}
                                                            style={{
                                                                backgroundColor:
                                                                    item === each.answer
                                                                        ? each?.question?.answer
                                                                              ?.answerOfQuestion[0] === item
                                                                            ? 'green'
                                                                            : 'red'
                                                                        : 'white',
                                                            }}
                                                        >
                                                            <Box display={'flex'} ml={-1} pr={1}>
                                                                <GreenRadio
                                                                    checked={
                                                                        each?.question?.answer?.answerOfQuestion[0] ===
                                                                        item
                                                                    }

                                                                    disabled={each?.question?.answer?.answerOfQuestion[0] !==
                                                                        item}
                                                                />
                                                            </Box>
                                                            <div
                                                                className={classes.activeOption}
                                                                style={{ width: '100%' }}
                                                            >
                                                                <Accordion
                                                                    style={{
                                                                        backgroundColor:
                                                                            item === each.answer
                                                                                ? each?.question?.answer
                                                                                      ?.answerOfQuestion[0] === item
                                                                                    ? 'green'
                                                                                    : 'red'
                                                                                : 'white',
                                                                    }}
                                                                >
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
                                                    }
                                                </div>
                                            ))}
                                        </Box>
                                    }
                                </Grid>
                            ) : each?.isCorrect !== false ? (
                                <Box display={'flex'} flexDirection={'column'} ml={1} pt={1} width={'100%'}>
                                    <Typography variant={'body2'}>{'Right Answer :-'}</Typography>
                                    <div style={{ width: '100%' }}>
                                        <Accordion>
                                            <AccordionSummary
                                                aria-controls="panel1a-content"
                                                expandIcon={<ExpandMoreIcon />}
                                                id="panel1a-header"
                                            >
                                                <Typography className={classes.heading}>{`Answer`}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <QuillViewer html={each?.question?.answer?.answerOfQuestion[0]} />
                                            </AccordionDetails>
                                        </Accordion>
                                    </div>
                                    {/*<Box display={'flex'} my={0.8} width={'100%'}>*/}
                                    {/*    <Box*/}
                                    {/*        alignItems={'center'}*/}
                                    {/*        className={classes.activeOption}*/}
                                    {/*        display={'flex'}*/}
                                    {/*        p={1}*/}
                                    {/*        px={2}*/}
                                    {/*        width={'100%'}*/}
                                    {/*    >*/}
                                    {/*        <Typography className={classes.activeText} variant={'body2'} width={'100%'}>*/}
                                    {/*            {each?.question?.answer?.answerOfQuestion[0]}*/}
                                    {/*        </Typography>*/}
                                    {/*    </Box>*/}
                                    {/*</Box>*/}
                                </Box>
                            ) : (
                                <Box display={'flex'} flexDirection={'column'} ml={1} pt={1} width={'100%'}>
                                    <Typography variant={'body2'}>{'Right Answer :-'}</Typography>
                                    <div className={classes.activeOption} style={{ width: '100%' }}>
                                        <Accordion>
                                            <AccordionSummary
                                                aria-controls="panel1a-content"
                                                expandIcon={<ExpandMoreIcon />}
                                                id="panel1a-header"
                                            >
                                                <Typography className={classes.heading}>{`Answer`}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <QuillViewer html={each?.question?.answer?.answerOfQuestion[0]} />
                                            </AccordionDetails>
                                        </Accordion>
                                    </div>
                                    {/*<Box display={'flex'} my={0.8} width={'100%'}>*/}
                                    {/*    <Box*/}
                                    {/*        alignItems={'center'}*/}
                                    {/*        className={classes.activeOption}*/}
                                    {/*        display={'flex'}*/}
                                    {/*        p={1}*/}
                                    {/*        px={2}*/}
                                    {/*        width={'100%'}*/}
                                    {/*    >*/}
                                    {/*        <Typography className={classes.activeText} variant={'body2'} width={'100%'}>*/}
                                    {/*            {each?.question?.answer?.answerOfQuestion[0]}*/}
                                    {/*        </Typography>*/}
                                    {/*    </Box>*/}
                                    {/*</Box>*/}
                                    <Typography variant={'body2'}>{'Answer Given :-'}</Typography>
                                    <div className={classes.activeOption2} style={{ width: '100%' }}>
                                        <Accordion>
                                            <AccordionSummary
                                                aria-controls="panel1a-content"
                                                expandIcon={<ExpandMoreIcon />}
                                                id="panel1a-header"
                                            >
                                                <Typography className={classes.heading}>{`Answer`}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <QuillViewer html={each?.answer} />
                                            </AccordionDetails>
                                        </Accordion>
                                    </div>
                                    {/*<Box display={'flex'} my={0.8} width={'100%'}>*/}
                                    {/*    <Box*/}
                                    {/*        alignItems={'center'}*/}
                                    {/*        className={classes.activeOption2}*/}
                                    {/*        display={'flex'}*/}
                                    {/*        p={1}*/}
                                    {/*        px={2}*/}
                                    {/*        width={'100%'}*/}
                                    {/*    >*/}
                                    {/*        <Typography className={classes.activeText} variant={'body2'} width={'100%'}>*/}
                                    {/*            {each?.answer}*/}
                                    {/*        </Typography>*/}
                                    {/*    </Box>*/}
                                    {/*</Box>*/}
                                </Box>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <QuestionSkeleton />
                )}
            </Grid>
            {/*<QuestionEditDialogForDetailsPage*/}
            {/*    allQuestions={allQuestions}*/}
            {/*    examDetails={examDetails}*/}
            {/*    id={id}*/}
            {/*    index={index}*/}
            {/*    openDialog={openDialog}*/}
            {/*    setAllQuestions={setAllQuestions}*/}
            {/*    setExamDetails={setExamDetails}*/}
            {/*    setOpenDialog={setOpenDialog}*/}
            {/*/>*/}
        </React.Fragment>
    );
};

export default AllQuestionsSectionOfStudent;
