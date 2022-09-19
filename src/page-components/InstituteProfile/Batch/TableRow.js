/**
 *
 * @createdBy Ramakanta Kar
 * @email ramakantakar1997@gmail.com
 * @description students
 * @createdOn 26/01/21 11:55 PM
 */

import React, { useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Link from '../../../components/Link';
import DialogTitle from '../../../components/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import Translate from '../../../components/Translate';
// import { useRouter } from 'next/router';
// import useHandleError from '../../../hooks/useHandleError';
// import { TimetableService } from '../../../apis/rest.app';

const TableRowBatch = ({ data }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow>
                <TableCell>{data?.name}</TableCell>
                <TableCell align="left">{data?.instituteCourse?.name}</TableCell>
                <TableCell align="left">{data?.totalSeatCount}</TableCell>
                <TableCell align="left">{data?.acquiredSeatCount}</TableCell>
                <TableCell align="center">{data?.price}</TableCell>
                {/*<Box align="right" component={TableCell} display={'flex'} flexDirection={'column'}>*/}
                {/*    <Button component={Link} href={`/institute-attendance/${data._id}`}>*/}
                {/*        <Translate root={'institute/batch'}>{'live_classes'}</Translate>*/}
                {/*    </Button>*/}
                {/*</Box>*/}
                {/*<Box align="right" component={TableCell} display={'flex'} flexDirection={'column'}>*/}
                {/*    <Button color={'primary'} component={Link} href={`/exams/${data._id}`} variant={'outlined'}>*/}
                {/*        /!*<Translate root={'institute/batch'}>{'view_exam'}</Translate>*!/*/}
                {/*        Exams*/}
                {/*    </Button>*/}
                {/*</Box>*/}

                {/*<TableCell align="right">*/}
                {/*    <Button component={Link} href={`/institute/batch/${data._id}/student`}>*/}
                {/*        /!*<Translate root={'institute/batch'}>{'view_students'}</Translate>*!/*/}
                {/*        Students*/}
                {/*    </Button>*/}
                {/*</TableCell>*/}
                {/*<TableCell align="center">*/}
                {/*    <Button*/}
                {/*        color={'primary'}*/}
                {/*        onClick={() => {*/}
                {/*            setOpen(true);*/}
                {/*        }}*/}
                {/*        variant={'contained'}*/}
                {/*    >*/}
                {/*        /!*<Translate root={'institute/batch'}>{'view_syllabus'}</Translate>*!/*/}
                {/*        Syllabus*/}
                {/*    </Button>*/}
                {/*</TableCell>*/}
                {/*<TableCell align="center">*/}
                {/*    <Button color={'primary'} component={Link} href={`/time-tables/${data._id}`} variant={'outlined'}>*/}
                {/*        {'Timetable'}*/}
                {/*    </Button>*/}
                {/*</TableCell>*/}
                <TableCell align="center">
                    <Button color={'primary'} component={Link} href={`/batch-details/${data._id}`}>
                        {'Batch Details'}
                    </Button>
                </TableCell>
                <Dialog
                    fullWidth
                    maxWidth={'sm'}
                    onClose={() => {
                        setOpen(false);
                    }}
                    open={open}
                >
                    <DialogTitle
                        onClose={() => {
                            setOpen(false);
                        }}
                    >
                        <Translate root={'institute/batch'}>{'allSyllabuses'}</Translate>
                    </DialogTitle>
                    <DialogContent>
                        {data?.syllabuses &&
                            data.syllabuses.map((each) => (
                                <Box alignItems={'center'} display={'flex'} key={each._id}>
                                    <Typography>{each.name}</Typography>
                                    <span style={{ flexGrow: 1 }} />
                                    <Button component={Link} href={`/batch-videos/${each._id}?batch=${data._id}`}>
                                        <Translate root={'institute/batch'}>{'view_progress'}</Translate>
                                    </Button>
                                </Box>
                            ))}
                    </DialogContent>
                </Dialog>
            </TableRow>
        </>
    );
};
TableRowBatch.propTypes = {
    data: PropTypes.object.isRequired,
};
export default TableRowBatch;
