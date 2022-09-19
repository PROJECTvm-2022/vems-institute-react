import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FirstDialogForInstituteToEdit from './FirstDialogForInstituteToEdit';
import Translate from '../../components/Translate';
import PropTypes from 'prop-types';
import DialogTitle from '../../components/DialogTitle';
import EditProfileDetails from './EditProfileDetails';
import EditContactDetails from './EditContactDetails';
import {useUser} from "../../store/UserContext";

function InstitutionEditDialog({
    tableOpen,
    setTableOpen,
    each,
    position,
    institutionData,
    setInstitutionData,
    onProfile = false,
    onEditContact = false,
}) {
    const handleClose = () => {
        setTableOpen(false);
    };
    const [user] = useUser();

    return (
        <>
            <Dialog fullWidth maxWidth={'xs'} onClose={handleClose} open={tableOpen}>
                <DialogTitle onClose={handleClose}>
                    {<Translate>{'institute.form.imageInputTitle.chooseTexts'}</Translate>}
                </DialogTitle>
                <DialogContent>
                    {!onProfile ? (
                        <FirstDialogForInstituteToEdit
                            each={each}
                            institutionData={institutionData}
                            position={position}
                            setInstitutionData={setInstitutionData}
                            setTableOpen={setTableOpen}
                            tableOpen={tableOpen}
                        />
                    ) : !onEditContact ? (
                        <EditProfileDetails
                            each={each}
                            institutionData={institutionData}
                            onProfile={onProfile}
                            position={position}
                            setInstitutionData={setInstitutionData}
                            setTableOpen={setTableOpen}
                            tableOpen={tableOpen}
                        />
                    ) : (
                        <EditContactDetails
                            each={each}
                            institutionData={institutionData}
                            onProfile={onProfile}
                            position={position}
                            setInstitutionData={setInstitutionData}
                            setTableOpen={setTableOpen}
                            tableOpen={tableOpen}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default InstitutionEditDialog;

InstitutionEditDialog.propTypes = {
    each: PropTypes.any.isRequired,
    institutionData: PropTypes.any,
    setInstitutionData: PropTypes.any,
    position: PropTypes.number,
    onProfile: PropTypes.bool,
    onEditContact: PropTypes.bool,
    tableOpen: PropTypes.any.isRequired,
    setTableOpen: PropTypes.func.isRequired,
};
