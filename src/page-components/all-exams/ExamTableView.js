import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
// import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';
// import MenuItem from '@material-ui/core/MenuItem';
// import Paper from '@material-ui/core/Paper';
// import Popper from '@material-ui/core/Popper';
// import { makeStyles } from '@material-ui/core/styles';
// import IconButton from '@material-ui/core/IconButton';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
// import theme from '../../theme';
// import Translate from '../../../src/components/Translate';
// import Confirm from '../../components/Confirm';
// import { useSnackbar } from 'notistack';
// import { useLanguage } from '../../store/LanguageStore';
import PropTypes from 'prop-types';
// import Grow from '@material-ui/core/Grow';
// import ClickAwayListener from '@material-ui/core/ClickAwayListener';
// import MenuList from '@material-ui/core/MenuList';
// import { ExamService, InstituteCourse } from '../../apis/rest.app';
// // import ScheludedDialog from './ScheludedDialog';
// // import ExamAddDialog from './ExamAddDialog';
// import useHandleError from '../../hooks/useHandleError';
import Button from '@material-ui/core/Button';
import moment from 'moment/moment';

// const useStyles = makeStyles((theme) => ({
//     avatar: {
//         height: 65,
//         width: 65,
//     },
//     avatarDiv: {
//         height: 75,
//         width: 75,
//     },
//     button: {
//         color: theme.palette.primary.main,
//     },
//     cameraIcon: {
//         height: 15,
//         width: 20,
//     },
//     editIcon: {
//         height: 20,
//         width: 25,
//         color: theme.palette.common.white,
//     },
//     editIconDiv: {
//         height: 60,
//         width: 60,
//         borderRadius: 7,
//     },
//     tableCell: {
//         wordBreak: 'break-all',
//         minWidth: '50px',
//         maxWidth: '100px',
//     },
//     addressDiv: {
//         wordBreak: 'break-all',
//         // width: '100%',
//         minWidth: '200px',
//         maxWidth: '300px',
//     },
// }));

function ExamTableView({ each, position, id }) {
    // console.log('each============>', each);
    // const classes = useStyles();
    // const { enqueueSnackbar } = useSnackbar();
    // const Language = useLanguage('all-exams');
    // const handleError = useHandleError();

    return (
        <>
            <TableRow key={position}>
                <TableCell align="center">{position + 1}</TableCell>
                <TableCell align="center">{each?.exam?.title || 'N/A'}</TableCell>
                <TableCell align={'center'} component="th" scope="row">
                    {moment(each?.startedAt).format('DD-MM-YYYY')}
                </TableCell>
                <TableCell align={'center'} component="th" scope="row">
                    {moment(each?.startedAt).format('h:mm a')}
                </TableCell>
                <TableCell align="center">{each?.exam?.mark?.total || '0'}</TableCell>
                <TableCell align="center">{each?.exam?.questionCount || '0'}</TableCell>
                <TableCell>
                    <Button color={'primary'} href={`/student-exam-details/${each.exam?._id}?studentId=${id}`}>
                        {'View Report'}
                    </Button>
                </TableCell>
            </TableRow>
        </>
    );
}

ExamTableView.propTypes = {
    each: PropTypes.any,
    allExam: PropTypes.any,
    setAllExams: PropTypes.any,
    position: PropTypes.number,
    id: PropTypes.number,
    type: PropTypes.any,
};

export default ExamTableView;
