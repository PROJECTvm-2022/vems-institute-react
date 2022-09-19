import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import CropperDialog from '../components/cropper/CropperDialog';
import { uploadFile, CreateUser, UserService } from '../apis/rest.app';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../store/LanguageStore';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Typography from '@material-ui/core/Typography';
import Translate from '../components/Translate';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTeacherDetailsData } from '../store/TeacherDetailsContext';

const useStyle = makeStyles((theme) => ({
    mainIconDiv: {
        padding: theme.spacing(1),
    },
    iconDiv: {
        backgroundColor: '#EEF7FF',
        width: 320,
        height: 320,
        borderRadius: theme.shape.borderRadius,
    },
    icon: {
        height: '40%',
        width: 'auto',
        color: theme.palette.primary.main,
    },
    imagePreview: {
        height: 320,
        width: 320,
    },
    container: {
        position: 'relative',
        height: 320,
        width: 320,
    },
    imageContainer: {
        position: 'absolute',
    },
    deleteIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 99,
    },
    nextButton: {
        marginTop: theme.spacing(2),
    },
    withBorder: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        padding: 4,
        borderRadius: 4,
    },
    withOutBorder: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid #fff',
        cursor: 'pointer',
        padding: 4,
    },
}));

function ImageEditDialogForTeacher({ setOpenDialog, openDialog, each }) {
    const [image, setImage] = useState(each?.avatar || 'NA');
    const [imageFile, setImageFile] = useState('');
    const [src, setSrc] = useState();
    const [show, setShow] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage('students/[id]');
    const classes = useStyle();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useTeacherDetailsData();

    const dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const [edited, setEdited] = useState(false);

    const handleEdit = async () => {
        let _logo = image;
        if (edited) {
            await uploadFile(imageFile).then((response) => {
                _logo = response.link;
            });
        }
        setLoading(true);
        await UserService.patch(each?._id, {
            avatar: _logo,
        })
            .then((res) => {
                if (data) {
                    let _data = data;
                    _data.avatar = res.avatar;
                    setData(data);
                }
                enqueueSnackbar(Language.get('studentEditedMessage'), {
                    variant: 'success',
                });
                setEdited(true);
                setOpenDialog(false);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : Language.get('deleteError'), {
                    variant: 'error',
                });
            })
            .finally(() => setLoading(false));
    };

    const handleClose = () => {
        setOpenDialog(false);
    };
    return (
        <>
            <div>
                <Dialog aria-labelledby="form-dialog-title" onClose={handleClose} open={openDialog}>
                    <DialogTitle id="form-dialog-title">
                        {<Translate root={'students/[id]'}>{'title'}</Translate>}
                    </DialogTitle>
                    <DialogContent>
                        {image !== '' ? (
                            <Box className={classes.container} onClick={() => setShow(true)}>
                                <div className={classes.deleteIcon}>
                                    <IconButton>
                                        <CancelIcon
                                            onClick={() => {
                                                setImage('');
                                                setSrc('');
                                                setEdited(true);
                                            }}
                                        />
                                    </IconButton>
                                </div>
                                <Box className={classes.imageContainer}>
                                    <img alt={'image'} className={classes.imagePreview} src={image} />
                                </Box>
                            </Box>
                        ) : (
                            <Box
                                alignItems="center"
                                className={classes.iconDiv}
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                onClick={() => setShow(true)}
                            >
                                <CloudUploadIcon className={classes.icon} />
                                <Typography variant={'body2'}>
                                    {<Translate root={'students/[id]'}>{'chooseImage'}</Translate>}
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={handleClose}>
                            {<Translate root={'students/[id]'}>{'cancel'}</Translate>}
                        </Button>
                        <Button color="primary" disabled={image === '' && loading} onClick={handleEdit}>
                            {loading ? (
                                <CircularProgress color={'primary'} size={20} />
                            ) : (
                                <Translate root={'students/[id]'}>{'upload'}</Translate>
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <CropperDialog
                aspectRatio={16 / 16}
                cancel={() => {
                    setShow(false);
                    setSrc(null);
                }}
                cancelLabel={'Cancel'}
                dismiss={() => {
                    setShow(false);
                }}
                okLabel={'Save'}
                onCropped={(data) => {
                    setShow(false);
                    setImage(data);
                    setImageFile(dataURLtoFile(data, 'imageToUpload.png'));
                }}
                onSelected={(s) => {
                    setSrc(s);
                }}
                show={show}
                src={src}
                // themeColors={themeColors}
            />
        </>
    );
}
ImageEditDialogForTeacher.propTypes = {
    each: PropTypes.any.isRequired,
    teacherData: PropTypes.array,
    setTeacherData: PropTypes.array,
    position: PropTypes.number.isRequired,
    openDialog: PropTypes.any.isRequired,
    setOpenDialog: PropTypes.any.isRequired,
};

export default ImageEditDialogForTeacher;
