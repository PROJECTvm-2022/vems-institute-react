/**
 *
 * @createdBy Ramakanta Kar
 * @email ramakantakar1997@gmail.com
 * @description Teachers
 * @createdOn 29/01/21 08:25 PM
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useUser } from '../../store/UserContext';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core/index';
import Box from '@material-ui/core/Box';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../../store/LanguageStore';
import { AnswerService } from '../../apis/rest.app';
import CircularProgress from '@material-ui/core/CircularProgress';
import Translate from '../../components/Translate';
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router';

const useStyle = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    eachBox: {
        cursor: 'pointer',
    },
    selected: {
        background: '#F2F9FF',
        border: '1px solid #037FFB',
        boxSizing: 'border-box',
        cursor: 'pointer',
        padding: theme.spacing(1.5),
        borderRadius: 5,
    },
    unselected: {
        background: '#F3F3F3',
        border: '1px solid #E0E0E0',
        cursor: 'pointer',
        boxSizing: 'border-box',
        padding: theme.spacing(1.5),
        borderRadius: 5,
    },
}));

const QuestionRow = ({ each, pos, setCurrent, total, setAnswers, answers, studentVideo }) => {
    const classes = useStyle();
    const [selectedAnswer, setSelectedAnswer] = useState('');
    // const [user] = useUser();
    const { enqueueSnackbar } = useSnackbar();
    const Router = useRouter();

    const [loading, setLoading] = useState(false);
    const [complete, setComplete] = useState(false);
    const Language = useLanguage('video/[videoId]');

    const AddAnswer = () => {
        if (selectedAnswer.trim() === '') {
            enqueueSnackbar(Language.get('select_answer'), {
                variant: 'error',
            });
        } else {
            if (pos + 1 < total) {
                let _answers = answers;
                _answers[pos].answer = selectedAnswer;
                setAnswers([..._answers]);
                setCurrent(pos + 1);
            } else {
                SaveAnswer();
            }
        }
    };

    const SaveAnswer = () => {
        let _answers = answers;
        _answers[pos].answer = selectedAnswer;
        setLoading(true);
        AnswerService.create({ answers: _answers, studentVideo: studentVideo })
            .then((response) => {
                if (response && response.videoTobeUnlocked)
                    Router.push('/video/[videoId]', '/video/' + response.videoTobeUnlocked);
            })
            .catch(() => {})
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Box pb={4} pl={6} pr={6} pt={4}>
            {complete ? (
                <Box
                    alignItems={'center'}
                    display={'flex'}
                    flexDirection={'column'}
                    height={'300px'}
                    justifyContent={'center'}
                    width={'100%'}
                >
                    <Typography variant={'h3'}>{Language.get('congrats')}</Typography>
                    <Box mt={2} />
                    <Typography align={'center'}>{Language.get('congrats_message')}</Typography>
                </Box>
            ) : (
                <Grid container item md={12} sm={12} spacing={2} xs={12}>
                    <Grid item md={12} sm={12} xs={12}>
                        {`Q${pos + 1}: ${each.question}`}
                    </Grid>
                    {each.choices.map((each) => (
                        <Grid item key={each} md={12} sm={12} xs={12}>
                            <Box
                                className={each === selectedAnswer ? classes.selected : classes.unselected}
                                onClick={() => {
                                    setSelectedAnswer(each);
                                }}
                            >
                                {each}
                            </Box>
                        </Grid>
                    ))}
                    <Grid item md={12} sm={12} xs={12}>
                        <Box display={'flex'} justifyContent={'flex-end'}>
                            <Button
                                color="primary"
                                disabled={loading}
                                fullWidth
                                onClick={AddAnswer}
                                size="medium"
                                variant={'contained'}
                            >
                                {loading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    <Translate root={'video/[videoId]'}>{'next_answer'}</Translate>
                                )}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

QuestionRow.propTypes = {
    each: PropTypes.object.isRequired,
    pos: PropTypes.any.isRequired,
    setCurrent: PropTypes.func.isRequired,
    total: PropTypes.any.isRequired,
    studentVideo: PropTypes.any.isRequired,
    answers: PropTypes.array.isRequired,
    setAnswers: PropTypes.func.isRequired,
};
export default QuestionRow;
