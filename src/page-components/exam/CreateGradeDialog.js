import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '../../components/DialogTitle';
import { useLanguage } from '../../store/LanguageStore';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Translate from '../../components/Translate';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import { useExamCreateData } from '../../store/ExamCreateContext';
import { ExamService } from '../../apis/rest.app';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import * as Papa from 'papaparse';

function CreateGradeDialog({ gradeTable, handleCloseGradeTable, allExam, setAllExams, setGradeTable, each, position }) {
    const Language = useLanguage('all-exams');
    const Router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [createFields, setCreateFields] = useState([]);
    const [values, setValues] = useState(
        each
            ? each?.mark?.grades
            : [
                  {
                      name: '',
                      mark: '',
                  },
              ],
    );

    const deleteOption = (index) => {
        let _vals = values;
        _vals.splice(index, 1);
        setValues([..._vals]);
    };

    const validate = () => {
        if (values[0]?.name?.trim() === '') {
            enqueueSnackbar(Language.get('messages.name'), {
                variant: 'error',
            });
            return false;
        }
        if (values[0]?.mark?.trim() === '') {
            enqueueSnackbar(Language.get('messages.mark'), {
                variant: 'error',
            });
            return false;
        }
        if (values[values.length - 1]?.name?.trim() === '') {
            enqueueSnackbar(Language.get('messages.name'), {
                variant: 'error',
            });
            return false;
        }
        if (values[values.length - 1]?.mark?.trim() === '') {
            enqueueSnackbar(Language.get('messages.mark'), {
                variant: 'error',
            });
            return false;
        }
        return true;
    };

    // console.log('students',students);

    const [data, setData] = useExamCreateData();

    console.log('data', data);

    const createExam = () => {
        if (validate()) {
            if (!each) {
                setLoading(true);
                ExamService.create({
                    ...data,
                    'mark.grades': values,
                    status: 1,
                })
                    .then((res) => {
                        setAllExams([...allExam]);
                        Router.push('/create-questions', `/create-questions/${res._id}`);
                        setGradeTable(false);
                        setLoading(false);
                    })
                    .catch((error) => {
                        enqueueSnackbar(
                            error.message ? error.message : Language.get('institute.form.error.deleteError'),
                            {
                                variant: 'error',
                            },
                        );
                        setLoading(false);
                    });
            } else {
                setLoading(true);
                ExamService.patch(
                    each?._id,
                    {
                        title: data?.name,
                        description: data?.description,
                        syllabus: data?.syllabus,
                        subject: data?.subject,
                        'mark.grades': values,
                        type: data?.type,
                    },
                    {
                        query: {
                            $populate: ['course', 'subject'],
                        },
                    },
                )
                    .then((res) => {
                        let _allExams = allExam;
                        _allExams[position] = res;
                        setAllExams([..._allExams]);
                        setGradeTable(false);
                        setLoading(false);
                    })
                    .catch((error) => {
                        enqueueSnackbar(
                            error.message ? error.message : Language.get('institute.form.error.deleteError'),
                            {
                                variant: 'error',
                            },
                        );
                        setLoading(false);
                    });
            }
        }
    };

    return (
        <>
            <Dialog
                fullWidth
                maxWidth={'xs'}
                onClose={() => {
                    handleCloseGradeTable();
                    setCreateFields([]);
                }}
                open={gradeTable}
            >
                <DialogTitle
                    onClose={() => {
                        handleCloseGradeTable();
                        setCreateFields([]);
                    }}
                >
                    <Translate root={'all-exams'}>{'CreateGrades'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} flexDirection={'column'}>
                        {values?.length &&
                            values.map((each, index) => (
                                <Box display={'flex'} justifyContent={'space-between'} key={each?._id} mt={1}>
                                    <Box maxWidth={'90px'} width={'100%'}>
                                        <TextField
                                            fullWidth
                                            onChange={(e) => {
                                                let _values = values;
                                                _values[index].name = e.target.value;
                                                setValues([..._values]);
                                            }}
                                            placeholder={'Grade' + (index + 1)}
                                            size="small"
                                            value={each?.name}
                                            variant={'outlined'}
                                        />
                                    </Box>
                                    <Box ml={1} />
                                    <TextField
                                        onChange={(e) => {
                                            let _values = values;
                                            if (e.target.value < 0) {
                                                _values[index].mark = 0;
                                            } else {
                                                _values[index].mark = e.target.value;
                                                setValues([..._values]);
                                            }
                                        }}
                                        placeholder={'Enter Percentage' + (index + 1)}
                                        size="small"
                                        type={'number'}
                                        value={each?.mark}
                                        variant={'outlined'}
                                    />
                                    {
                                        <IconButton disabled={index === 0} onClick={() => deleteOption(index)}>
                                            <Delete color={index === 0 ? 'grey': 'secondary'} />
                                        </IconButton>
                                    }
                                </Box>
                            ))}
                        <Box mb={2} />
                        <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                            <Button
                                color={'primary'}
                                disabled={values?.length === 7}
                                onClick={() => {
                                    let _values = values;
                                    _values.push({ name: '', mark: '' });
                                    setValues([..._values]);
                                }}
                                variant={'outlined'}
                            >
                                {'Add Options'}
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button color={'secondary'} onClick={handleCloseGradeTable} variant={'outlined'}>
                        <Translate root={'all-exams'}>{'cancel'}</Translate>
                    </Button>
                    <Button color={'primary'} onClick={createExam} variant={'contained'}>
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <Translate root={'all-exams'}>{'createExam'}</Translate>
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CreateGradeDialog;

CreateGradeDialog.propTypes = {
    each: PropTypes.any,
    position: PropTypes.number,
    gradeTable: PropTypes.any,
    setGradeTable: PropTypes.any,
    setHasMore: PropTypes.any,
    allExam: PropTypes.any,
    setAllExams: PropTypes.any,
    handleCloseGradeTable: PropTypes.any,
};
