/**
 *
 * @createdBy Ramakanta Kar
 * @email ramakantakar1997@gmail.com
 * @description Teachers
 * @createdOn 26/01/21 11:55 PM
 */

import React from 'react';
import { makeStyles } from '@material-ui/styles';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';
import Translate from '../../components/Translate';
import Button from '@material-ui/core/Button';
import { Avatar } from '@material-ui/core/index';

const useStyle = makeStyles(() => ({
    buttonContainer: {
        minWidth: 120,
    },
    avatar: {
        fontSize: 22,
        fontWeight: 'bold',
    },
}));

const TableRowTeacher = ({ data }) => {
    const classes = useStyle();
    const { user } = data;

    return (
        <TableRow>
            <TableCell align="left">
                <Avatar className={classes.avatar} src={user?.avatar}>
                    {user?.name.charAt(0).toUpperCase()}
                </Avatar>
            </TableCell>
            <TableCell>
                <Translate root={'teachers'}>{user?.name}</Translate>
            </TableCell>
            <TableCell align="left">
                <Translate root={'teachers'}>{user?.email}</Translate>
            </TableCell>
            <TableCell align="left">
                <Translate root={'teachers'}>{user?.phone}</Translate>
            </TableCell>
            <TableCell align="left">
                <Translate root={'teachers'}>{user?.address}</Translate>
            </TableCell>
            <TableCell align="center" className={classes.buttonContainer}>
                <Button as={'teachers/[id]'} color={'primary'} href={`teachers/${data?._id}`} size={'small'}>
                    <Translate root={'teachers'}>{'view_profile'}</Translate>
                </Button>
            </TableCell>
        </TableRow>
    );
};
TableRowTeacher.propTypes = {
    data: PropTypes.object.isRequired,
};
export default TableRowTeacher;
