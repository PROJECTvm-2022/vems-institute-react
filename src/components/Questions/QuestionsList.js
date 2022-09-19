import React, { useState } from 'react';
import DialogTitle from '../DialogTitle';
import Translate from '../Translate';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { useLanguage } from '../../store/LanguageStore';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import { QuestionsService } from '../../apis/rest.app';
import useHandleError from '../../hooks/useHandleError';
import InfiniteScroll from 'react-infinite-scroller';
import QuestionListItem from './QuestionListItem';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

const QuestionsList = ({ entityType, entityId }) => {
    const Language = useLanguage('teacher-video-details/details/[videoId]');

    const [questions, setQuestions] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [question, setQuestion] = useState('');
    const [answerType, setAnswerType] = useState(1);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleError = useHandleError();

    const [choices, setChoices] = useState([
        {
            value: '',
            isCorrect: false,
        },
        {
            value: '',
            isCorrect: false,
        },
    ]);

    const validate = () => {
        if (question.trim() === '') {
            enqueueSnackbar('Enter a Question', { variant: 'warning' });
            return false;
        }
        if (choices[0]?.value === '') {
            enqueueSnackbar('Option1 can' + "'" + 't be empty', { variant: 'warning' });
            return false;
        }
        if (choices[1]?.value === '') {
            enqueueSnackbar('Option2 can' + "'" + 't be empty', { variant: 'warning' });
            return false;
        }
        if (choices[choices?.length - 1]?.value === '') {
            enqueueSnackbar(`Option${choices?.length} can` + "'" + 't be empty ', { variant: 'warning' });
            return false;
        }
        if (choices.filter((each) => each.isCorrect === true)?.length === 0) {
            enqueueSnackbar('Please provide a correct answer', { variant: 'warning' });
            return false;
        }
        if (choices.filter((each) => each.isCorrect === true)?.length > 1) {
            enqueueSnackbar('You can' + "'" + 't select more than one correct answer', { variant: 'warning' });
            return false;
        }
        return true;
    };

    const handleCreate = () => {
        if (validate()) {
            setCreating(true);
            QuestionsService.create({
                entityId,
                entityType,
                question,
                answer: {
                    answerOfQuestion: choices.filter((each) => each.isCorrect).map((each) => each.value),
                },
                answerType,
                choices: choices.map((each) => each.value),
            })
                .then((response) => {
                    setQuestions(([...qs]) => {
                        qs.push(response);
                        return qs;
                    });
                    setQuestion('');
                    setAnswerType(1);
                    setChoices([
                        {
                            value: '',
                            isCorrect: false,
                        },
                        {
                            value: '',
                            isCorrect: false,
                        },
                    ]);
                    setCreateModalOpen(false);
                })
                .catch(handleError())
                .finally(() => {
                    setCreateModalOpen(false);
                    setCreating(false);
                });
        }
    };

    const loadQuestions = () => {
        if (questionsLoading) return;
        setQuestionsLoading(true);
        QuestionsService.find({ query: { entityId } })
            .then((response) => {
                // const { total, data } = response;
                // const _questions = [...questions, ...data];
                setQuestions(response);
                setHasMore(false);
            })
            .catch(handleError())
            .finally(() => {
                setQuestionsLoading(false);
                setHasMore(false);
            });
    };

    const onDelete = ({ _id }) =>
        setQuestions(([...questions]) => {
            const index = questions.findIndex((each) => each._id === _id);
            if (index > -1) questions.splice(index, 1);
            return questions;
        });

    const onEdit = (updatedData) =>
        setQuestions(([...questions]) => {
            const { _id } = updatedData;
            const index = questions.findIndex((each) => each._id === _id);
            if (index > -1) questions[index] = updatedData;
            return questions;
        });

    return (
        <React.Fragment>
            <Box alignItems="center" display="flex" justifyContent="space-between">
                <Typography variant="h4">{Language.get('tabs.questions')}</Typography>
            </Box>
            <InfiniteScroll
                container
                hasMore={hasMore}
                loadMore={loadQuestions}
                loader={<CircularProgress size={24} />}
            >
                {questions.map((each, index) => (
                    <QuestionListItem
                        index={index + 1}
                        key={each._id}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        question={each}
                    />
                ))}
                {!hasMore && !questions.length && (
                    <Box display="flex" justifyContent="center">
                        <Translate root={'teacher-video-details/details/[videoId]'}>{'messages.noQuestions'}</Translate>
                    </Box>
                )}
            </InfiniteScroll>
        </React.Fragment>
    );
};

QuestionsList.propTypes = {
    entityType: PropTypes.string.isRequired,
    entityId: PropTypes.string.isRequired,
};

export default QuestionsList;
