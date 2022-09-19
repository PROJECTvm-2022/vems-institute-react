import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { StudentExamService } from '../../apis/rest.app';
import Avatar from '@material-ui/core/Avatar';
import Confirm from '../../components/Confirm';

function ExamTableView({ each, position, allExam, setAllExams, setHasMore, id }) {
    const allowStudentToEnter = () => {
        Confirm('Are you sure ? ', 'Do you want to allow this student to join this exam again ? ', 'Yes').then(() => {
            StudentExamService.patch(each?._id, { attendanceStatus: 1 })
                .then(() => {
                    let _exams = allExam;
                    setAllExams([]);
                    setHasMore(true);
                    _exams.splice(position, 1);
                    setAllExams([..._exams]);
                })
                .catch(() => {});
        });
    };

    return (
        <>
            <TableRow key={position}>
                <TableCell align="center">
                    <Avatar src={each?.student?.avatar} />
                </TableCell>
                <TableCell align="center">{each?.student?.name || 'N/A'}</TableCell>
                <TableCell align="left">{each?.student?.email || 'N/A'}</TableCell>
                <TableCell>{each?.student?.phone || 'N/A'}</TableCell>
                <TableCell>
                    <Button color={'primary'} href={`/student-exam-details/${id}?studentId=${each?.student?._id}`}>
                        {'View Report'}
                    </Button>
                </TableCell>
                {each?.attendanceStatus === 3 && each?.status === 3 && (
                    <Box component={TableCell}>
                        <Button color={'primary'} onClick={allowStudentToEnter}>
                            {'Re-Enter'}
                        </Button>
                    </Box>
                )}
                {each?.attendanceStatus === 2 && (
                    <Box component={TableCell}>
                        <Button color={'primary'} disabled>
                            {'Exam In Progress'}
                        </Button>
                    </Box>
                )}
            </TableRow>
        </>
    );
}

ExamTableView.propTypes = {
    each: PropTypes.any,
    allExam: PropTypes.any,
    setAllExams: PropTypes.any,
    position: PropTypes.number,
    _id: PropTypes.number,
    setHasMore: PropTypes.any,
};

export default ExamTableView;
