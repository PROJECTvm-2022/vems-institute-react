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
import { BatchService, InstituteCoursesService } from '../../apis/rest.app';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { useLanguage } from '../../store/LanguageStore';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';

const BatchAddDialog = ({ batch, open, setBatch, setOpen }) => {
    const Language = useLanguage('institute/batch');
    const { enqueueSnackbar } = useSnackbar();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState('none');
    const [totalSeatCount, setTotalSeatCount] = useState('');
    const [price, setPrice] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        InstituteCoursesService.find({
            query: {
                $limit: 50,
            },
        })
            .then((response) => {
                const { data } = response;
                setCourses(data);
            })
            .catch(() => {});
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const validate = () => {
        if (!course || course === 'none') {
            enqueueSnackbar(Language.get('courseError'), {
                variant: 'warning',
            });
            return false;
        } else if (name === '') {
            enqueueSnackbar(Language.get('nameError'), {
                variant: 'warning',
            });
            return false;
        } else if (!price || price === '' || price === '0') {
            enqueueSnackbar(Language.get('priceError'), {
                variant: 'warning',
            });
            return false;
        } else if (!totalSeatCount || totalSeatCount === '' || totalSeatCount === '0') {
            enqueueSnackbar(Language.get('seatError'), {
                variant: 'warning',
            });
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (validate()) {
            setLoading(true);
            BatchService.create(
                {
                    instituteCourse: course,
                    price,
                    name,
                    totalSeatCount,
                },
                {
                    query: {
                        $populate: ['instituteCourse', 'syllabuses'],
                    },
                },
            )
                .then((response) => {
                    const result = [response, ...batch];
                    setBatch([...result]);
                    setOpen(false);
                })
                .catch(() => {})
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
                <Typography variant={'h4'}>{<Translate root={'institute/batch'}>{'add'}</Translate>}</Typography>
            </DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="dense" variant="outlined">
                    <Select
                        onChange={(e) => {
                            setCourse(e.target.value);
                        }}
                        value={course}
                    >
                        <MenuItem value={'none'}>
                            <Translate root={'institute/batch'}>{'select_course'}</Translate>
                        </MenuItem>
                        {courses &&
                            courses.map((each) => (
                                <MenuItem key={each._id} value={each._id}>
                                    {each.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label={<Translate root={'institute/batch'}>{'name'}</Translate>}
                    margin={'dense'}
                    onChange={(event) => setName(event.target.value)}
                    value={name}
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    inputProps={{
                        min: 1,
                    }}
                    label={<Translate root={'institute/batch'}>{'price'}</Translate>}
                    margin={'dense'}
                    onChange={(event) => setPrice(event.target.value)}
                    type={'number'}
                    value={price}
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    inputProps={{
                        min: 1,
                    }}
                    label={<Translate root={'institute/batch'}>{'seat_count'}</Translate>}
                    margin={'dense'}
                    onChange={(event) => setTotalSeatCount(event.target.value)}
                    type={'number'}
                    value={totalSeatCount}
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleClose}>
                    <Translate root={'institute/batch'}>{'cancel'}</Translate>
                </Button>
                <Button autoFocus color="primary" disabled={loading} onClick={handleSave} variant={'contained'}>
                    {loading ? <CircularProgress size={24} /> : <Translate root={'institute/batch'}>{'add'}</Translate>}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

BatchAddDialog.propTypes = {
    batch: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
    setBatch: PropTypes.func.isRequired,
    setOpen: PropTypes.func.isRequired,
};

export default BatchAddDialog;
