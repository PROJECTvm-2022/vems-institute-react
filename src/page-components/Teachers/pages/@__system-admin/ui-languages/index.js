import React, { useState } from 'react';
import SystemAdminLayout from '../../../src/components/Layouts/SystemAdminLayout';
import Typography from '@material-ui/core/Typography';
import { useUILanguages } from '../../../src/store/UILanguagesContext';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { UILanguagesService } from '../../../src/apis/rest.app';
import useHandleError from '../../../src/hooks/useHandleError';
import Confirm from '../../../src/components/Confirm';
import Switch from '@material-ui/core/Switch';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';

const UILanguages = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [languages, setUILanguages] = useUILanguages();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleError = useHandleError();

    const validate = () => {
        if (name === '') {
            enqueueSnackbar('Enter a Name', { variant: 'warning' });
            return false;
        }
        if (code === '') {
            enqueueSnackbar('Enter a Code Name', { variant: 'warning' });
            return false;
        }
        return true;
    };

    const handleCreateLanguage = () => {
        if (validate()) {
            UILanguagesService.create({ name, code })
                .then((response) => {
                    setUILanguages((lan) => {
                        lan.push(response);
                        return lan;
                    });
                    setName('');
                    setCode('');
                    setDialogOpen(false);
                })
                .catch(handleError());
        }
    };

    const deleteLanguage = (row, position) => {
        Confirm('Are you sure').then(() => {
            UILanguagesService.remove(row._id)
                .then(() => {
                    let _languages = languages;
                    _languages.splice(position, 1);
                    setUILanguages([]);
                    setUILanguages(_languages);
                })
                .catch(handleError());
        });
    };
    const handleChangeStatus = (index, row, status) => () => {
        Confirm('Are you sure?').then(() => {
            UILanguagesService.patch(row._id, { status })
                .then((response) => {
                    let _languages = languages;
                    _languages[index] = response;
                    setUILanguages([..._languages]);
                })
                .catch(handleError());
        });
    };

    return (
        <div>
            <Box display="flex" justifyContent="space-between" mb={2} mt={1}>
                <Typography variant="h4">Languages</Typography>
                <Button color="primary" onClick={() => setDialogOpen(true)} variant="contained">
                    Create Language
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Code</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {languages &&
                            languages.map((row, index) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.code}</TableCell>
                                    <TableCell align="right">
                                        {row.status}
                                        <Switch
                                            checked={row.status === 1}
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            onChange={handleChangeStatus(index, row, row.status === 1 ? -1 : 1)}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton>
                                            <Delete
                                                onClick={() => {
                                                    deleteLanguage(row, index);
                                                }}
                                            />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="xs"
                onClose={() => setDialogOpen(false)}
                open={dialogOpen}
            >
                <DialogTitle id="form-dialog-title">Create Language</DialogTitle>
                <DialogContent>
                    {/*<DialogContentText>*/}
                    {/*    To subscribe to this website, please enter your email address here. We will send updates*/}
                    {/*    occasionally.*/}
                    {/*</DialogContentText>*/}
                    <TextField
                        autoFocus
                        fullWidth
                        label="Name"
                        margin="dense"
                        onChange={(ev) => setName(ev.target.value)}
                        type="text"
                        value={name}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Code"
                        margin="dense"
                        onChange={(ev) => setCode(ev.target.value)}
                        type="text"
                        value={code}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => setDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button color="primary" disabled={loading} onClick={handleCreateLanguage}>
                        {loading ? <CircularProgress color={'primary'} size={20} /> : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

UILanguages.layout = SystemAdminLayout;

export default UILanguages;
