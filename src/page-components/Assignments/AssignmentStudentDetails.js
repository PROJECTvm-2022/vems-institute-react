import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import useHandleError from '../../hooks/useHandleError';
import { useRouter } from 'next/router';
import { StudentAssignmentService } from '../../apis/rest.app';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Link from '../../components/Link';
import Button from '@material-ui/core/Button';

// eslint-disable-next-line react/prop-types
const AssignmentStudentDetails = () => {
    const handleError = useHandleError();
    const Router = useRouter();
    const { id: AssignmentId } = Router.query;
    const [loading, setLoading] = useState(true);

    const [studentData, setStudentData] = useState([]);

    useEffect(() => {
        if (!AssignmentId) return;
        setLoading(true);
        StudentAssignmentService.find({ query: { assignment: AssignmentId } })
            .then((response) => {
                setStudentData(response);
                setLoading(false);
            })
            .catch((error) => {
                handleError()(error);
                setLoading(false);
            });
    }, [AssignmentId]);

    return (
        <React.Fragment>
            <Paper component={Box} p={2}>
                <Box mb={4}>
                    <Typography variant={'h5'}>{'Student Details'}</Typography>
                </Box>

                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{'Name'}</TableCell>
                                <TableCell align="center">Marks</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="right" />
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {studentData.length ? (
                                studentData.map((row) => (
                                    <TableRow key={row?._id}>
                                        <TableCell>
                                            <Link href={`/students/${row?.student?._id}`}>{row?.student?.name}</Link>
                                        </TableCell>
                                        <TableCell align="center">{row?.mark || '---'}</TableCell>
                                        <TableCell align="center">
                                            {row?.status === 2 && (
                                                <Chip
                                                    label={'Not submitted'}
                                                    size={'small'}
                                                    style={{ background: '#ffe500' }}
                                                />
                                            )}
                                            {row?.status === 3 && (
                                                <Chip color={'primary'} label={'Submitted'} size={'small'} />
                                            )}
                                            {row?.status === 4 && (
                                                <Chip
                                                    label={'Verified'}
                                                    size={'small'}
                                                    style={{ background: '#12ff00' }}
                                                />
                                            )}
                                            {row?.status === 5 && (
                                                <Chip color={'secondary'} label={'Expired'} size={'small'} />
                                            )}
                                            {row?.status === 0 && (
                                                <Chip color={'secondary'} label={'Cancelled'} size={'small'} />
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                color={'primary'}
                                                component={Link}
                                                href={`/assignment/detail/${row?._id}`}
                                                size={'small'}
                                                variant={'outlined'}
                                            >
                                                {'View Details'}
                                            </Button>
                                        </TableCell>
                                        <TableCell />
                                    </TableRow>
                                ))
                            ) : (
                                <Typography component={Box} m={3} variant={'body2'}>
                                    {'No students'}
                                </Typography>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </React.Fragment>
    );
};

// AssignmentStudentDetails.propType = {
//     assignmentData: PropTypes.object.isRequired,
//     loading: PropTypes.bool.isRequired,
// };

export default AssignmentStudentDetails;
