import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
// import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// const useStyles = makeStyles(() => ({
//     avatar: {
//         height: 65,
//         width: 65,
//     },
// }));

function TransactionsTableView({ each, position }) {
    // const classes = useStyles();

    return (
        <>
            <TableRow key={position}>
                <TableCell>{position + 1}</TableCell>
                <TableCell>{each?._id || 'N/A'}</TableCell>
                <TableCell>{each?.createdBy?.name || 'N/A'}</TableCell>
                <TableCell>{each?.amount || 'N/A'}</TableCell>
                <TableCell>{each?.institute?.name || 'N/A'}</TableCell>
            </TableRow>
        </>
    );
}

TransactionsTableView.propTypes = {
    each: PropTypes.any,
    institutionData: PropTypes.any,
    setInstitutionData: PropTypes.any,
    position: PropTypes.number,
    _id: PropTypes.number,
};

export default TransactionsTableView;
