import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '../../components/DialogTitle';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import Translate from '../../components/Translate';
import { UserService } from '../../apis/rest.app';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Checkbox, FormControlLabel } from '@material-ui/core/index';

function PermissionDialogForStudent({ setOpen, open, data, modules, onEdit }) {
    const { enqueueSnackbar } = useSnackbar();

    console.log('data=============>', data);

    const handleClose = () => {
        setOpen(false);
    };

    const [tempModules, setTempModules] = useState(data.modules ?? []);

    useEffect(() => {
        setTempModules(data ? data.modules ?? [] : []);
    }, [data]);
    const givePermission = () => {
        UserService.patch(data?._id, { modules: tempModules.map((each) => each._id) })
            .then(() => {
                setOpen(false);
                data.modules = tempModules;
                // onEdit(tempModules);
                enqueueSnackbar('Permissions Given Successfully', { variant: 'success' });
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something Went Wrong', {
                    variant: 'error',
                });
                setOpen(false);
            });
    };
    return (
        <>
            <div>
                <Dialog fullWidth={'sm'} onClose={handleClose} open={open}>
                    <DialogTitle onClose={handleClose}>
                        {<Translate root={'students/[id]'}>{'Permissions'}</Translate>}
                    </DialogTitle>
                    <DialogContent>
                        <Box component={Grid} container mt={2} spacing={0}>
                            {modules && modules.length !== 0 ? (
                                modules.map((module) => (
                                    <Grid item key={module._id} md={12} sm={12} xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={tempModules.some((value) => value?._id === module?._id)}
                                                    color="primary"
                                                    onChange={() => {
                                                        if (tempModules.some((value) => value?._id === module?._id)) {
                                                            setTempModules(
                                                                tempModules.filter((each) => each._id !== module._id),
                                                            );
                                                        } else {
                                                            setTempModules([...tempModules, module]);
                                                        }
                                                    }}
                                                />
                                            }
                                            label={module?.name}
                                        />
                                    </Grid>
                                ))
                            ) : (
                                <Box
                                    alignItems="center"
                                    display="flex"
                                    flexDirection="column"
                                    height="80vh"
                                    justifyContent="center"
                                >
                                    <Translate>{'No Modules Found'}</Translate>
                                </Box>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={handleClose}>
                            {<Translate root={'students/[id]'}>{'cancel'}</Translate>}
                        </Button>
                        <Button color="primary" onClick={givePermission} variant={'contained'}>
                            <Translate root={'students/[id]'}>{'Give Permission'}</Translate>
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}
PermissionDialogForStudent.propTypes = {
    open: PropTypes.any.isRequired,
    setOpen: PropTypes.any.isRequired,
    data: PropTypes.any,
    modules: PropTypes.any,
    onEdit: PropTypes.any,
};

export default PermissionDialogForStudent;
