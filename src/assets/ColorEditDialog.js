import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from 'prop-types';
import { editInstitute } from '../../apis/institutes';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../../store/LanguageStore';
import Box from '@material-ui/core/Box';
import Translate from '../../components/Translate';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '../../components/DialogTitle';
import { useInstituteDetailsData } from '../../store/InstitutionDetailsContext';

const useStyle = makeStyles((theme) => ({
    mainIconDiv: {
        padding: theme.spacing(1),
    },
    iconDiv: {
        backgroundColor: '#EEF7FF',
        width: '100%',
        height: 190,
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

function ColorEditDialog({
    setColorEditor,
    colorEditor,
    each,
    position,
    institutionData,
    setInstitutionData,
    onProfile = false,
}) {
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage();
    const classes = useStyle();

    const [, setData] = useInstituteDetailsData();

    const [loading, setLoading] = useState(false);

    const handleEdit = () => {
        setLoading(true);
        editInstitute(each._id, {
            colorCode: { primary: color },
        })
            .then((res) => {
                if (!onProfile) {
                    let _institutionData = institutionData;
                    _institutionData[position] = res;
                    setInstitutionData([..._institutionData]);
                } else {
                    setData(res);
                }
                setLoading(false);
                enqueueSnackbar(Language.get('institute.form.successMessage.editedSuccessFully'), {
                    variant: 'success',
                });
                setColorEditor(false);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : Language.get('institute.form.error.deleteError'), {
                    variant: 'error',
                });
            });
    };

    const handleClose = () => {
        setColorEditor(false);
    };
    const [color, setColor] = useState(each?.colorCode?.primary || '');

    const themeColor = [
        {
            primary: '#037FFB',
            id: 1,
        },
        {
            primary: '#EA4335',
            id: 2,
        },
        {
            primary: '#FBB603',
            id: 3,
        },
        {
            primary: '#4BBF57',
            id: 4,
        },
        {
            primary: '#8C21BE',
            id: 5,
        },
        {
            primary: '#2F415E',
            id: 6,
        },
    ];
    return (
        <>
            <Dialog fullWidth onClose={handleClose} open={colorEditor}>
                <DialogTitle onClose={() => handleClose()}>
                    {<Translate>{'institute.form.imageInputTitle.chooseColor'}</Translate>}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        {themeColor.map((each) => (
                            <Grid item key={each.id} md={3} sm={3} xs={4}>
                                <div
                                    className={color === each.primary ? classes.withBorder : classes.withOutBorder}
                                    /* we have to write style here cz we r maping a array of different colors */
                                    onClick={() => {
                                        setColor(each.primary);
                                    }}
                                    style={{ border: color === each.primary ? `2px solid ${each.primary}` : '' }}
                                >
                                    <Box
                                        height={'45px'}
                                        style={{
                                            background: each.primary,
                                        }}
                                        width={'100%'}
                                    />
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={handleClose}>
                        {<Translate>{'institute.form.button.cancel'}</Translate>}
                    </Button>
                    <Button color={'primary'} disabled={loading} onClick={handleEdit} variant={'contained'}>
                        {loading ? (
                            <Box alignItems={'center'} display={'flex'} justifyContent={'center'} px={2.2}>
                                <CircularProgress size={20} />
                            </Box>
                        ) : (
                            <Translate>{'institute.form.button.update'}</Translate>
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
ColorEditDialog.propTypes = {
    each: PropTypes.any.isRequired,
    institutionData: PropTypes.any,
    setInstitutionData: PropTypes.any,
    position: PropTypes.number,
    onProfile: PropTypes.bool,
    colorEditor: PropTypes.any.isRequired,
    setColorEditor: PropTypes.any.isRequired,
};

export default ColorEditDialog;
