/**
 *
 * @createdBy Ramakanta Kar
 * @email ramakantakar1997@gmail.com
 * @description Batch Add
 * @createdOn 10/02/21 03:55 PM
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Translate from '../../components/Translate';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Typography } from '@material-ui/core/index';
import { BatchService, StudentSeatService } from '../../apis/rest.app';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import moment from 'moment/moment';
import { useLanguage } from '../../store/LanguageStore';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

const AcceptDialog = ({ studentData, open, setStudentData, setOpen, each }) => {
    const Language = useLanguage('students/unapproved');
    const { enqueueSnackbar } = useSnackbar();

    const [instituteBatch, setInstituteBatch] = useState('none');
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        BatchService.find({
            query: {
                $limit: 50,
            },
        })
            .then((response) => {
                const { data } = response;
                setBatches(data);
            })
            .catch(() => {});
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const validate = () => {
        if (!instituteBatch || instituteBatch === 'none') {
            enqueueSnackbar(Language.get('batchError'), {
                variant: 'warning',
            });
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (validate()) {
            setLoading(true);
            StudentSeatService.patch(each._id, {
                status: 2,
                instituteBatch,
            })
                .then(() => {
                    let _studentData = studentData;
                    _studentData.splice(_studentData.indexOf(each), 1);
                    const result = [...studentData];
                    setStudentData(result);
                    setOpen(false);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Unable to accept request', {
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
            <DialogTitle>
                <Typography variant={'h4'}>
                    {<Translate root={'students/unapproved'}>{'accept_title'}</Translate>}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Box>
                        <Typography variant={'h4'}>{'Requested Course'}</Typography>
                        <Box mt={1} />
                        <Typography variant={'body2'}>{each?.instituteCourse?.name}</Typography>
                    </Box>
                    <Box>
                        <Typography variant={'h4'}>{'Date And Time'}</Typography>
                        <Box mt={1} />
                        <Box display={'flex'}>
                            <Typography variant={'body2'}>
                                {moment(each?.createdAt).utc(true).format('DD-MM-YYYY')}
                            </Typography>
                            <Box ml={2} />
                            <Typography variant={'body2'}>
                                {moment(each?.createdAt).utc(true).format('h:mm a')}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <FormControl fullWidth margin="dense" variant="outlined">
                    <Select
                        onChange={(e) => {
                            setInstituteBatch(e.target.value);
                        }}
                        value={instituteBatch}
                    >
                        <MenuItem value={'none'}>
                            <Translate root={'students/unapproved'}>{'select_batch'}</Translate>
                        </MenuItem>
                        {batches &&
                            batches.map((each) => (
                                <MenuItem key={each._id} value={each._id}>
                                    {each.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleClose}>
                    <Translate root={'students/unapproved'}>{'cancel'}</Translate>
                </Button>
                <Button autoFocus color="primary" disabled={loading} onClick={handleSave} variant={'contained'}>
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <Translate root={'students/unapproved'}>{'accept'}</Translate>
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AcceptDialog.propTypes = {
    studentData: PropTypes.array.isRequired,
    each: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    setStudentData: PropTypes.func.isRequired,
    setOpen: PropTypes.func.isRequired,
};

export default AcceptDialog;
