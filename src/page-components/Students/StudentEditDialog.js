import React from 'react';
import DialogTitle from '../../components/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FirstDialogForStudentToEdit from './FirstDialogForStudentToEdit';
import PropTypes from 'prop-types';
import Translate from '../../components/Translate';

const useStyles = makeStyles((theme) => ({
    button: {
        marginTop: theme.spacing(2),
    },
}));

function StudentEditDialog({
    openEditDialog,
    setOpenEditDialog,
    position,
    each,
    setStudentData,
    studentData,
    onProfile = false,
}) {
    const classes = useStyles();

    const handleClose = () => {
        setOpenEditDialog(false);
    };

    return (
        <>
            <Dialog fullWidth maxWidth={'xs'} onClose={handleClose} open={openEditDialog}>
                <DialogTitle onClose={handleClose}>
                    <Typography variant="h4">
                        {<Translate root={'students/[id]'}>{'chooseTexts'}</Translate>}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <div className={classes.root}>
                        <FirstDialogForStudentToEdit
                            each={each}
                            onProfile={onProfile}
                            position={position}
                            setOpenEditDialog={setOpenEditDialog}
                            setStudentData={setStudentData}
                            studentData={studentData}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
StudentEditDialog.propTypes = {
    each: PropTypes.any,
    position: PropTypes.number,
    studentData: PropTypes.array,
    setCourse: PropTypes.any,
    onProfile: PropTypes.bool,
    setStudentData: PropTypes.func,
    openEditDialog: PropTypes.any.isRequired,
    setOpenEditDialog: PropTypes.func.isRequired,
};
export default StudentEditDialog;
