import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CreateExamEditDialog from './CreateExamEditDialog';
import CreateGradeEditDialog from './CreateGradeEditDialog';

function ExamEditDialog({ tableOpen, setTableOpen, each, setExamDetails }) {
    const handleClose = () => {
        setTableOpen(false);
    };
    const [gradeTable, setGradeTable] = useState(false);
    const handleCloseGradeTable = () => {
        setGradeTable(false);
    };

    return (
        <>
            <CreateExamEditDialog
                each={each}
                handleClose={handleClose}
                setGradeTable={setGradeTable}
                setTableOpen={setTableOpen}
                tableOpen={tableOpen}
            />
            <CreateGradeEditDialog
                each={each}
                gradeTable={gradeTable}
                handleCloseGradeTable={handleCloseGradeTable}
                setExamDetails={setExamDetails}
                setGradeTable={setGradeTable}
            />
        </>
    );
}

export default ExamEditDialog;

ExamEditDialog.propTypes = {
    each: PropTypes.any,
    institutionData: PropTypes.any,
    setInstitutionData: PropTypes.any,
    position: PropTypes.number,
    tableOpen: PropTypes.any,
    setTableOpen: PropTypes.any,
    setAllExams: PropTypes.any,
    allExam: PropTypes.any,
};
