import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useInstituteDetailsData } from '../../store/InstitutionDetailsContext';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { Button, Divider, IconButton, Typography } from '@material-ui/core/index';
import Translate from '../../components/Translate';
import EditIcon from '../../../public/EditIcon.svg';
import InstitutionEditDialog from '../../page-components/InstituteProfile/InstitutionEditDialog';
import ColorEditDialog from '../../page-components/InstituteProfile/ColorEditDialog';

const useStyles = makeStyles((theme) => ({
    headerCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(0.5, 1),
        // background: theme.palette.primary.main,
        borderRadius: theme.spacing(0.5),
    },
    contentCard: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1),
    },
    rootCard: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1),
    },
    headerTypo: {
        color: theme.palette.common.white,
    },
}));

export default function DetailsLeftProfile() {
    const [data] = useInstituteDetailsData();
    const classes = useStyles();
    const [tableOpen, setTableOpen] = useState(false);
    const handleButtonOpen = () => {
        setTableOpen(true);
    };

    const [colorEditor, setColorEditor] = useState(false);
    const handleOpenColorEditor = () => {
        setColorEditor(true);
    };

    return (
        <>
            <Paper className={classes.rootCard}>
                <div
                    className={classes.headerCard}
                    style={{ background: data && data.colorCode && data.colorCode.primary }}
                >
                    <Typography className={classes.headerTypo} variant={'h4'}>
                        <Translate root={'institute/[id]'}>{'details.contactDetails'}</Translate>
                    </Typography>
                    <IconButton
                        onClick={() => {
                            handleButtonOpen();
                        }}
                    >
                        <img alt={'Edit Icon'} src={EditIcon} />
                    </IconButton>
                </div>
                <div className={classes.contentCard}>
                    <Typography variant={'caption'}>
                        <Translate root={'institute/[id]'}>{'details.number'}</Translate>
                    </Typography>
                    <Typography variant={'h6'}>{data && data.phone}</Typography>
                </div>
                <Divider />
                <div className={classes.contentCard}>
                    <Typography variant={'caption'}>
                        <Translate root={'institute/[id]'}>{'details.email'}</Translate>
                    </Typography>
                    <Typography variant={'h6'}>{data && data.email}</Typography>
                </div>
                <Divider />
                <div className={classes.contentCard}>
                    <Typography variant={'caption'}>
                        <Translate root={'institute/[id]'}>{'details.address'}</Translate>
                    </Typography>
                    <Typography variant={'h6'}>{data && data.address}</Typography>
                </div>
                <Divider />
                <div className={classes.contentCard}>
                    <Typography variant={'caption'}>
                        <Translate root={'institute/[id]'}>{'details.website'}</Translate>
                    </Typography>
                    <Typography variant={'h6'}>{data && data.website}</Typography>
                </div>
            </Paper>
            <Box mt={3} />
            <Paper className={classes.rootCard}>
                <div
                    className={classes.headerCard}
                    style={{ background: data && data.colorCode && data.colorCode.primary }}
                >
                    <Typography className={classes.headerTypo} variant={'h4'}>
                        <Translate root={'institute/[id]'}>{'details.appearance'}</Translate>
                    </Typography>
                    <IconButton
                        onClick={() => {
                            handleOpenColorEditor();
                        }}
                    >
                        <img alt={'Edit icon'} src={EditIcon} />
                    </IconButton>
                </div>
                <div className={classes.contentCard}>
                    <Typography variant={'caption'}>
                        <Translate root={'institute/[id]'}>{'details.theme'}</Translate>
                    </Typography>
                    <Box
                        bgcolor={data && data.colorCode ? data.colorCode.primary : 'primary.main'}
                        color="white"
                        mt={1}
                        px={2}
                        py={1}
                        width="fit-content"
                    >
                        {data && data.colorCode.primary}
                    </Box>
                </div>
            </Paper>
            <InstitutionEditDialog
                each={data}
                onEditContact={true}
                onProfile={true}
                setTableOpen={setTableOpen}
                tableOpen={tableOpen}
            />
            <ColorEditDialog colorEditor={colorEditor} each={data} onProfile={true} setColorEditor={setColorEditor} />
        </>
    );
}
