import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Confirm from '../../components/Confirm';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../../store/LanguageStore';
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';

function ScheduledTableItem({ each, position, allScheduleArray, setAllScheduleArray }) {
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage('all-exams');

    const deleteThis = () => {
        Confirm(
            Language.get('confirmDialog.titleForDelete'),
            Language.get('confirmDialog.messageForDeleteofBatch'),
            Language.get('confirmDialog.okLebel'),
            Language.get('confirmDialog.options'),
        )
            .then(() => {
                let _data = allScheduleArray;
                _data.splice(position, 1);
                setAllScheduleArray([]);
                setAllScheduleArray(_data);
                enqueueSnackbar(Language.get('successMessage.deletedSuccessFully'), {
                    variant: 'success',
                });
            })
            .catch(() => {});
    };

    return (
        <>
            <TableRow key={position}>
                <TableCell align="left">{each?.institute?.name || 'N/A'}</TableCell>
                <TableCell align="left">
                    {allScheduleArray
                        .filter((each1) => each1.institute._id === each.institute._id)
                        .map((each) => each.name)
                        .join(',') || 'N/A'}
                </TableCell>
                <TableCell align="center">
                    <Box display={'flex'} justifyContent={'center'}>
                        <Tooltip arrow title={Language.get('state.form.button.delete')}>
                            <IconButton onClick={deleteThis}>
                                <DeleteIcon color={'secondary'} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </TableCell>
            </TableRow>
        </>
    );
}
ScheduledTableItem.propTypes = {
    each: PropTypes.any.isRequired,
    position: PropTypes.number.isRequired,
    allScheduleArray: PropTypes.array.isRequired,
    setAllScheduleArray: PropTypes.func.isRequired,
};

export default ScheduledTableItem;
