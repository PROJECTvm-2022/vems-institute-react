/**
 *
 * @createdBy Ramakanta Kar
 * @email ramakantakar1997@gmail.com
 * @description students
 * @createdOn 26/01/21 11:55 PM
 */

import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';

const TableRowBatch = ({ data }) => {
    return (
        <TableRow>
            <TableCell>{data?.name}</TableCell>
            <TableCell align="left">{data?.instituteCourse?.name}</TableCell>
            <TableCell align="left">{data?.totalSeatCount}</TableCell>
            <TableCell align="left">{data?.acquiredSeatCount}</TableCell>
            <TableCell align="left">{data?.price}</TableCell>
        </TableRow>
    );
};
TableRowBatch.propTypes = {
    data: PropTypes.object.isRequired,
};
export default TableRowBatch;
