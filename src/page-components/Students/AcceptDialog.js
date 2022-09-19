import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useLanguage } from '../../store/LanguageStore';
import { BatchService, SyllabusService, TeacherStudentService } from '../../apis/rest.app';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Translate from '../../components/Translate';
import FormControl from '@material-ui/core/FormControl';
import { useUser } from '../../store/UserContext';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function AcceptDialog({ open, setOpen, each, position, studentData, setStudentData }) {
    const Language = useLanguage('students');
    const [loading, setLoading] = useState(false);
    const [batch, setBatch] = useState('none');
    const [batchs, setBatchs] = useState([]);
    const [syllabuses, setSyllabuses] = useState([]);
    const Router = useRouter();

    const { enqueueSnackbar } = useSnackbar();

    const [user] = useUser();
    useEffect(() => {
        BatchService.find({
            query: {
                $skip: 0,
                $limit: 50,
                $populate: ['course', 'specialization', 'currentSemester'],
                institute: user.institute,
            },
        })
            .then((response) => {
                setBatchs(response.data);
            })
            .catch(() => {});
        SyllabusService.find({
            query: {
                $skip: 0,
                $limit: 5,
                institute: user.institute,
            },
        })
            .then((response) => {
                setSyllabuses(response.data);
            })
            .catch(() => {});
    }, []);

    const handleApprove = () => {
        if (batch === 'none') {
            enqueueSnackbar(Language.get('batch_err'), {
                variant: 'error',
            });
        } else if (syllabuses.length === 0) {
            enqueueSnackbar(Language.get('syllabus_err'), {
                variant: 'error',
            });
        } else {
            setLoading(true);
            TeacherStudentService.patch(each._id, {
                status: 1,
                syllabuses: syllabuses.map((e) => e._id),
                batch: batch,
            })
                .then(() => {
                    Router.reload();
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : Language.get('approve_errr'), {
                        variant: 'error',
                    });
                })
                .finally(() => setLoading(false));
        }
    };

    return (
        <Dialog
            aria-describedby="alert-dialog-description"
            aria-labelledby="alert-dialog-title"
            fullWidth
            maxWidth={'xs'}
            onClose={() => setOpen(false)}
            open={open}
        >
            <DialogTitle id="alert-dialog-title">{Language.get('accept_title')}</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="dense" variant="outlined">
                    <Select
                        onChange={(e) => {
                            setBatch(e.target.value);
                        }}
                        value={batch}
                    >
                        <MenuItem value={'none'}>
                            <Translate root={'students'}>{'select_batch'}</Translate>
                        </MenuItem>
                        {batchs &&
                            batchs.map((each) => (
                                <MenuItem key={each._id} value={each._id}>
                                    {each.course.name +
                                        ' | ' +
                                        each.specialization.name +
                                        ' | ' +
                                        each.startYear +
                                        '-' +
                                        each.endYear}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button color="primary" disabled={loading} onClick={handleApprove} variant={'contained'}>
                    {loading ? <CircularProgress color="inherit" size={20} /> : 'Approve'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
