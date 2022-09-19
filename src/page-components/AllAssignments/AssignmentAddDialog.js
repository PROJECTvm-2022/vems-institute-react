import React from 'react';
import PropTypes from 'prop-types';
import CreateAssignmentDialog from './CreateAssignmentDialog';

function ExamAddDialog({ type, tableOpen, setTableOpen, allAssignments, setAllAssignments, each, position }) {
    const handleClose = () => {
        setTableOpen(false);
    };

    return (
        <>
            <CreateAssignmentDialog
                allAssignments={allAssignments}
                each={each}
                handleClose={handleClose}
                position={position}
                setAllAssignments={setAllAssignments}
                setTableOpen={setTableOpen}
                tableOpen={tableOpen}
                type={type}
            />
        </>
    );
}

export default ExamAddDialog;

ExamAddDialog.propTypes = {
    type: PropTypes.any,
    each: PropTypes.any,
    institutionData: PropTypes.any,
    setInstitutionData: PropTypes.any,
    position: PropTypes.number,
    tableOpen: PropTypes.any,
    setTableOpen: PropTypes.any,
    setAllAssignments: PropTypes.any,
    allAssignments: PropTypes.any,
};
