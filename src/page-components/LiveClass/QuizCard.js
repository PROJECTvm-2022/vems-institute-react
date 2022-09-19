import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { MessageService } from '../../apis/rest.app';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import { useUser } from '../../store/UserContext';

const useStyles = makeStyles((theme) => ({
    allOption: {
        borderRadius: 6,
        border: `1px solid ${theme.palette.common.black}`,
    },
    skeleton: {
        height: '60px',
    },
    button: {
        fontSize: '10px',
        borderRadius: '20px',
        fontWeight: 500,
    },
}));
/**
 *
 * @param each
 * @param index
 * @return {JSX.Element}
 * @constructor
 */
const QuizCard = ({ each, index }) => {
    const classes = useStyles();
    const [user] = useUser();
    const [expanded, setExpanded] = React.useState(0);
    const [students, setStudents] = React.useState([]);

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
        setOpen(false);
    };

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    const handleUpdate = () => {
        setLoading(true);
        setStudents([]);
        MessageService.find({
            query: {
                entityId: each?._id,
                $populate: ['createdBy'],
            },
        })
            .then((item) => {
                setStudents(item.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        handleUpdate();
    }, []);
    const [quizLoading, setQuizLoading] = useState(false);
    const publishQuiz = () => {
        setQuizLoading(true);
        MessageService.patch(
            each?._id,
            {
                status: 1,
            },
            {
                query: {
                    type: 2,
                },
            },
        )
            .then(() => {
                setQuizLoading(false);
            })
            .catch(() => {
                setQuizLoading(false);
            });
    };

    return (
        <React.Fragment>
            <Card component={Box} elevation={2} mt={2} p={1}>
                <Box mt={1} />
                <Box display={'flex'} justifyContent={'space-between'} mb={1}>
                    <Box display={'flex'}>
                        <Box mr={0.5}>
                            <Typography color={'textPrimary'} variant={'subtitle1'}>
                                {`Q. `}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography color={'textPrimary'} variant={'subtitle1'}>
                                {each?.text}
                            </Typography>
                        </Box>
                    </Box>
                    {each?.status === 2 && user?.role === 8 && (
                        <Box height={'30px'} width={'80px'}>
                            <Button
                                color={'primary'}
                                disabled={quizLoading}
                                onClick={publishQuiz}
                                size={'small'}
                                variant={'contained'}
                            >
                                {'Publish'}
                            </Button>
                        </Box>
                    )}
                </Box>
                <Accordion expanded={expanded === index + 1} onChange={handleChange(index + 1)}>
                    <AccordionSummary
                        aria-controls="panel1a-content"
                        expandIcon={<ExpandMoreIcon />}
                        id="panel1a-header"
                    >
                        <Typography color={'textSecondary'} variant={'subtitle1'}>
                            {expanded === index + 1 ? 'View less details' : 'View more details'}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box width={'100%'}>
                            <Box display={'flex'} my={1}>
                                <Box>
                                    <Typography>{'Total attempts :'}</Typography>
                                </Box>
                                <span style={{ flexGrow: 1 }} />
                                <Box>
                                    {each?.options?.reduce(
                                        (accumulator, currentValue) => accumulator + currentValue.supportCount,
                                        0,
                                    )}
                                    {" student's"}
                                </Box>
                            </Box>
                            <Box display={'flex'} my={1}>
                                <Box>
                                    <Typography>{'Correct answer %:'}</Typography>
                                </Box>
                                <span style={{ flexGrow: 1 }} />
                                <Box mr={7}>
                                    {each?.options
                                        ?.filter((e) => e.name === each.answerOfQuiz)
                                        .map((item) => (
                                            <Box key={item._id}>
                                                {Math.floor(
                                                    (item.supportCount /
                                                        each?.options?.reduce(
                                                            (accumulator, currentValue) =>
                                                                accumulator + currentValue.supportCount,
                                                            0,
                                                        )) *
                                                        100,
                                                ) || 0}
                                                {' %'}
                                            </Box>
                                        ))}
                                </Box>
                            </Box>
                            <Box display={'flex'} my={1}>
                                <Box>
                                    <Typography>{'Duration :'}</Typography>
                                </Box>
                                <span style={{ flexGrow: 1 }} />
                                <Box mr={5}>
                                    {each?.duration?.toString().length === 1 ? `0${each?.duration}` : each?.duration}{' '}
                                    {' Sec'}
                                </Box>
                            </Box>

                            <Typography color={'textSecondary'} variant={'subtitle2'}>
                                {'Options'}
                            </Typography>
                            <Box mt={1} />
                            {each?.options?.map((item, index) => (
                                <Box
                                    borderRadius={6}
                                    display={'flex'}
                                    key={item._id}
                                    mb={1}
                                    p={1}
                                    style={
                                        item?.name === each?.answerOfQuiz
                                            ? { background: 'rgba(76,245,28,0.58)' }
                                            : { background: '#d4d4d4' }
                                    }
                                    width={'100%'}
                                >
                                    {index + 1 === 1 ? 'a)' : index + 1 === 2 ? 'b)' : index + 1 === 3 ? 'c)' : 'd)'}
                                    <Box ml={0.5}>{item?.name}</Box>
                                    <span style={{ flexGrow: 1 }} />
                                    <Box>
                                        <Typography>
                                            {Math.floor(
                                                (item?.supportCount /
                                                    each?.options?.reduce(
                                                        (accumulator, currentValue) =>
                                                            accumulator + currentValue.supportCount,
                                                        0,
                                                    )) *
                                                    100,
                                            ) || 0}{' '}
                                            %
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                            {each?.status !== 2 && (
                                <>
                                    <ListItem button onClick={handleClick}>
                                        <Box display={'flex'} fontSize={'15px'} fontWeight={600}>
                                            <Box ml={4.5} />
                                            {open ? 'Hide' : 'View'}
                                            <Box ml={0.5} />
                                            {'Student Details'} <Box ml={0.5} />
                                            <Box ml={1} />
                                            {open ? <ExpandLess /> : <ExpandMore />}
                                        </Box>
                                    </ListItem>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <Box display={'flex'} justifyContent={'flex-end'}>
                                            {/*<Tooltip placement="left" title="Update List">*/}
                                            <Button
                                                className={classes.button}
                                                color={'primary'}
                                                onClick={handleUpdate}
                                                size={'small'}
                                                variant={'contained'}
                                            >
                                                {/*<ReplayIcon />*/}
                                                {'Refresh'}
                                            </Button>
                                            {/*</Tooltip>*/}
                                        </Box>
                                        <List component="div" disablePadding>
                                            {students.length ? (
                                                students.map((e, i) => {
                                                    let time = Math.floor(
                                                        (new Date(e?.createdAt).getTime() -
                                                            new Date(
                                                                each?.publishedAt ? each?.publishedAt : each?.createdAt,
                                                            ).getTime()) /
                                                            1000,
                                                    );
                                                    return (
                                                        <ListItem key={e?._id}>
                                                            <Box display={'flex'}>
                                                                <Box mt={2} width={'70px'}>
                                                                    {i + 1}
                                                                </Box>
                                                                <Box width={'120px'}>
                                                                    <ListItemText
                                                                        primary={e?.createdBy?.name}
                                                                        secondary={`Answer: ${e?.text}`}
                                                                    />
                                                                </Box>
                                                                <Box ml={1} mt={1.5} textAlign={'right'} width={'40px'}>
                                                                    <Typography variant={'h6'}>{`${time}`}</Typography>
                                                                    <Typography
                                                                        variant={'caption'}
                                                                    >{` Sec`}</Typography>
                                                                </Box>
                                                            </Box>
                                                        </ListItem>
                                                    );
                                                })
                                            ) : loading ? (
                                                <Box>
                                                    <Skeleton className={classes.skeleton} />
                                                    <Skeleton />
                                                    <Skeleton className={classes.skeleton} />
                                                    <Skeleton />
                                                    <Skeleton className={classes.skeleton} />
                                                    <Skeleton />
                                                </Box>
                                            ) : (
                                                <Box
                                                    alignItems={'center'}
                                                    component={Typography}
                                                    display={'flex'}
                                                    justifyContent={'center'}
                                                    variant={'caption'}
                                                >
                                                    {'No Answers yet'}
                                                </Box>
                                            )}
                                        </List>
                                    </Collapse>
                                </>
                            )}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Card>
        </React.Fragment>
    );
};

QuizCard.propTypes = {
    each: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default QuizCard;
