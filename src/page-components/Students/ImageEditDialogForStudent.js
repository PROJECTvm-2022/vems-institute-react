import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '../../components/DialogTitle';
import PropTypes from 'prop-types';
import CropperDialog from '../../components/cropper/CropperDialog';
import { uploadFile, UserService } from '../../apis/rest.app';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../../store/LanguageStore';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Typography from '@material-ui/core/Typography';
import Translate from '../../components/Translate';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useStudentDetailsData } from '../../store/StudentDetailsContext';

const useStyle = makeStyles((theme) => ({
    mainIconDiv: {
        padding: theme.spacing(1),
    },
    iconDiv: {
        backgroundColor: '#EEF7FF',
        width: 270,
        height: 270,
        borderRadius: theme.shape.borderRadius,
    },
    icon: {
        height: '40%',
        width: 'auto',
        color: theme.palette.primary.main,
    },
    nextButton: {
        marginTop: theme.spacing(2),
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
}));

function ImageEditDialogForStudent({
    setOpenDialog,
    openDialog,
    each,
    position,
    studentData,
    setStudentData,
    onProfile = false,
}) {
    const [image, setImage] = useState(each && each.avatar ? each.avatar : '');
    const [imageFile, setImageFile] = useState('');
    const [src, setSrc] = useState();
    const [, setData] = useStudentDetailsData();
    const [show, setShow] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage('students/[id]');
    const classes = useStyle();
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        if (edited) {
            await uploadFile(imageFile).then((response) => {
                _logo = response.link;
            });
        }
        await UserService.patch(each?._id, {
            avatar: _logo,
        })
            .then((res) => {
                if (!onProfile) {
                    let _studentData = studentData;
                    _studentData[position] = res;
                    setStudentData([..._studentData]);
                } else {
                    setData(res);
                }
                enqueueSnackbar(Language.get('successMessage.teacherEditedMessage'), {
                    variant: 'success',
                });
                setLoading(false);
                setOpenDialog(false);
                setEdited(true);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : Language.get('error.deleteError'), {
                    variant: 'error',
                });
            });
    };

    const handleClose = () => {
        setOpenDialog(false);
    };
    return (
        <>
            <div>
                <Dialog maxWidth={'sm'} onClose={handleClose} open={openDialog}>
                    <DialogTitle onClose={handleClose}>
                        {<Translate root={'students/[id]'}>{'chooseImage'}</Translate>}
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
                                    {<Translate root={'students/[id]'}>{'title'}</Translate>}
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={handleClose}>
                            {<Translate root={'students/[id]'}>{'cancel'}</Translate>}
                        </Button>
                        <Button
                            color="primary"
                            disabled={image === '' || loading}
                            onClick={handleEdit}
                            variant={'contained'}
                        >
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Translate root={'students/[id]'}>{'upload'}</Translate>
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <CropperDialog
                aspectRatio={16 / 9}
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
                    setEdited(true);
                    setImageFile(dataURLtoFile(data, 'imageToUpload.png'));
                }}
                onSelected={(s) => {
                    setSrc(s);
                }}
                show={show}
                src={src}
            />
        </>
    );
}
ImageEditDialogForStudent.propTypes = {
    each: PropTypes.any.isRequired,
    studentData: PropTypes.array,
    setStudentData: PropTypes.array,
    position: PropTypes.number,
    onProfile: PropTypes.bool,
    openDialog: PropTypes.any.isRequired,
    setOpenDialog: PropTypes.any.isRequired,
};

export default ImageEditDialogForStudent;
