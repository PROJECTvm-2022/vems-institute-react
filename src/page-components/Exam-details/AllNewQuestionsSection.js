import React, {useEffect, useState} from "react";
import makeStyles from "@material-ui/styles/makeStyles";
import {useRouter} from "next/router";
import useHandleError from "../../hooks/useHandleError";
import {useSnackbar} from "notistack";
import {ExamService, QuestionService, QuestionsService} from "../../apis/rest.app";
import Confirm from "../../components/Confirm";

const useStyle = makeStyles((theme) => ({
    activeOption: {
        border: `1px solid ${theme?.palette?.success?.light}`,
        background: '#DEFFE1',
        borderRadius: '5px',
        width: '100%',
    },
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
const AllQuestionsSection = ({ id }) => {

    const classes = useStyle();
    const Router = useRouter();
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();

    const { id: examId } = Router.query;

    const [allQuestions, setAllQuestions] = useState([]);
    const [allQuestionsLoading, setAllQuestionsLoading] = useState(false);

    const [examDetails, setExamDetails] = useState(null);
    const [examDetailsLoading, setExamDetailsLoading] = useState(false);

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
        setExamDetails(each);
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

        </React.Fragment>
    )
}
