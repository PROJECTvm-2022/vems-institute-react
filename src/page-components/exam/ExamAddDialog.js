import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CreateExamDialog from './CreateExamDialog';
import CreateGradeDialog from './CreateGradeDialog';

function ExamAddDialog({ tableOpen, setTableOpen, allExam, setAllExams, each, position}) {
    const handleClose = () => {
        setTableOpen(false);
    };
    const [gradeTable, setGradeTable] = useState(false);
    const handleCloseGradeTable = () => {
        setGradeTable(false);
    };

    return (
        <>
            <CreateExamDialog
                each={each}
                handleClose={handleClose}
                position={position}
                setGradeTable={setGradeTable}
                setTableOpen={setTableOpen}
                tableOpen={tableOpen}
            />
            <CreateGradeDialog
                allExam={allExam}
                each={each}
                gradeTable={gradeTable}
                handleCloseGradeTable={handleCloseGradeTable}
                position={position}
                setAllExams={setAllExams}
                setGradeTable={setGradeTable}
            />
        </>
    );
}

export default ExamAddDialog;

ExamAddDialog.propTypes = {
    each: PropTypes.any,
    institutionData: PropTypes.any,
    setInstitutionData: PropTypes.any,
    position: PropTypes.number,
    tableOpen: PropTypes.any,
    setTableOpen: PropTypes.any,
    setAllExams: PropTypes.any,
    allExam: PropTypes.any,
};
