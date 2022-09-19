import React, { useRef, useState } from 'react';
import SystemAdminLayout from '../../../src/components/Layouts/SystemAdminLayout';
import useHandleError from '../../../src/hooks/useHandleError';
import { UIIconsService, uploadFile } from '../../../src/apis/rest.app';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import { useUIIcons } from '../../../src/store/UIIconsContext';
import Avatar from '@material-ui/core/Avatar';
import CameraIcon from '@material-ui/icons/AddAPhoto';
import UIIconsListItem from '../../../src/page-components/system-admin/UIIconsListItem';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';

const UIIcons = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [icons, setUIIcons] = useUIIcons();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [name, setName] = useState('');
    const avatarRef = useRef();
    const [avatar, setAvatar] = useState('');
    const [isAvatarChange, setIsAvatarChange] = useState(false);
    const [iconLoading, setIconLoading] = useState(false);

    const handleError = useHandleError();

    const validate = () => {
        if (avatar === '') {
            enqueueSnackbar('Enter a Image', { variant: 'warning' });
            return false;
        }
        if (name === '') {
            enqueueSnackbar('Enter a Name', { variant: 'warning' });
            return false;
        }
        return true;
    };

    const handleCreateLanguage = async () => {
        if (validate()) {
            try {
                if (!isAvatarChange) throw new Error('Please select a image');
                const { link } = await uploadFile(avatarRef.current.files[0]);
                setIconLoading(true);
                const icon = UIIconsService.create({ name, path: link });
                setUIIcons((lan) => {
                    lan.push(icon);
                    return lan;
                });
                setName('');
                setDialogOpen(false);
                setIsAvatarChange(false);
                setIconLoading(false);
            } catch (e) {
                handleError()(e);
            }
        }
    };

    return (
        <div>
            <Box display="flex" justifyContent="space-between" mb={2} mt={1}>
                <Typography variant="h4">Icons</Typography>
                <Button color="primary" onClick={() => setDialogOpen(true)} variant="contained">
                    Create Icon
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Preview</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {icons &&
                            icons.map((row, index) => <UIIconsListItem icon={row} key={row.name} position={index} />)}
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
                    <label>
                        <Avatar
                            src={avatar}
                            style={{ margin: 'auto', height: 140, width: 140, fontSize: 80, cursor: 'pointer' }}
                        >
                            <CameraIcon fontSize="inherit" />
                        </Avatar>
                        <input
                            accept="image/*"
                            hidden
                            onChange={() => {
                                // eslint-disable-next-line no-undef
                                const fr = new FileReader();
                                // when image is loaded, set the src of the image where you want to display it
                                fr.onload = function () {
                                    setAvatar(this.result);
                                    setIsAvatarChange(true);
                                };
                                // fill fr with image data
                                fr.readAsDataURL(avatarRef.current.files[0]);
                            }}
                            ref={avatarRef}
                            type="file"
                        />
                    </label>
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
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => setDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button color="primary" disabled={setIconLoading} onClick={handleCreateLanguage}>
                        {iconLoading ? <CircularProgress color={'primary'} size={20} /> : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

UIIcons.layout = SystemAdminLayout;

export default UIIcons;
