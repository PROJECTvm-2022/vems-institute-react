import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from 'prop-types';
import CropperDialog from '../../components/cropper/CropperDialog';
import { uploadFile } from '../../apis/rest.app';
import { editInstitute } from '../../apis/institutes';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../../store/LanguageStore';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Typography from '@material-ui/core/Typography';
import Translate from '../../components/Translate';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '../../components/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useInstituteDetailsData } from '../../store/InstitutionDetailsContext';
import {useUser} from "../../store/UserContext";

const useStyle = makeStyles((theme) => ({
    mainIconDiv: {
        padding: theme.spacing(1),
    },
    iconDiv: {
        /* Hear we have to hardcode this color this color isn't use any where except this place*/
        backgroundColor: '#EEF7FF',
        width: 240,
        height: 240,
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
    imageDiv: {
        height: '240px',
        width: 'auto',
    },
}));

function ImageEditDialog({
    setOpenDialog,
    openDialog,
    each,
    position,
    institutionData,
    setInstitutionData,
    onProfile = false,
}) {
    const [image, setImage] = useState(each?.logo || '');
    const [imageFile, setImageFile] = useState('');
    const [src, setSrc] = useState();
    const [show, setShow] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage();
    const classes = useStyle();
    const [, setData] = useInstituteDetailsData();
    const [user, setUser] = useUser();
    const [loading, setLoading] = useState(false);

    const dataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(','),
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

    const validate = () => {
        if (image === '') {
            enqueueSnackbar(Language.get('institute.form.errorMessages.imageErrorMessage'), {
                variant: 'error',
            });
            return false;
        } else {
            return true;
        }
    };

    const handleEdit = async () => {
        if (validate()) {
            setLoading(true);
            let _logo = image;
            if (edited) {
                await uploadFile(imageFile).then((response) => {
                    _logo = response.path;
                });
            }
            await editInstitute(each._id, {
                logo: _logo,
            })
                .then((res) => {
                    if (!onProfile) {
                        let _institutionData = institutionData;
                        _institutionData[position] = res;
                        setInstitutionData([..._institutionData]);
                    } else {
                        setData(res);
                        let _user = user;
                        _user.institute = res;
                        setUser({..._user});
                    }
                    enqueueSnackbar(Language.get('institute.form.successMessage.editedSuccessFully'), {
                        variant: 'success',
                    });
                    setEdited(true);
                    setOpenDialog(false);
                    setLoading(false);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : Language.get('institute.form.error.deleteError'), {
                        variant: 'error',
                    });
                    setLoading(false);
                });
        }
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <div>
                <Dialog maxWidth={'sm'} onClose={handleClose} open={openDialog}>
                    <DialogTitle onClose={handleClose}>
                        {<Translate>{'institute.form.imageInputTitle.chooseImage'}</Translate>}
                    </DialogTitle>
                    <DialogContent>
                        {image !== '' ? (
                            <>
                                <Box display={'flex'} onClick={() => setShow(true)}>
                                    <img alt={'image'} className={classes.imageDiv} src={image} />
                                    <Box ml={-5}>
                                        <IconButton>
                                            <CancelIcon
                                                color={'secondary'}
                                                onClick={() => {
                                                    setImage('');
                                                    setSrc('');
                                                    setEdited(true);
                                                }}
                                            />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </>
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
                                    {<Translate>{'institute.form.imageInputTitle.title'}</Translate>}
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={handleClose}>
                            {<Translate>{'institute.form.button.cancel'}</Translate>}
                        </Button>
                        <Button
                            color="primary"
                            disabled={image === '' || loading}
                            onClick={handleEdit}
                            variant={'contained'}
                        >
                            {loading ? (
                                <CircularProgress size={20} />
                            ) : (
                                <Translate>{'institute.form.button.upload'}</Translate>
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <CropperDialog
                aspectRatio={1}
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
            />
        </>
    );
}
ImageEditDialog.propTypes = {
    each: PropTypes.any.isRequired,
    institutionData: PropTypes.any,
    setInstitutionData: PropTypes.any,
    position: PropTypes.number,
    onProfile: PropTypes.bool,
    openDialog: PropTypes.any.isRequired,
    setOpenDialog: PropTypes.any.isRequired,
};

export default ImageEditDialog;
