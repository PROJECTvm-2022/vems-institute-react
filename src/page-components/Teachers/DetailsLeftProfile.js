import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Divider, IconButton, Typography } from '@material-ui/core/index';
import Translate from '../../components/Translate';
import EditIcon from '../../../public/EditIcon.svg';
import { useTeacherDetailsData } from '../../store/TeacherDetailsContext';
import TeacherEditContactDetails from '../../page-components/Teachers/TeacherEditContactDetails';
import useHandleError from '../../hooks/useHandleError';

const useStyles = makeStyles((theme) => ({
    headerCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(0.5, 1),
        background: theme.palette.primary.main,
        borderRadius: theme.spacing(0.5),
    },
    contentCard: {
        flexWrap: 'wrap',
        padding: theme.spacing(1),
    },
    rootCard: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1),
    },
    headerTypo: {
        color: theme.palette.common.white,
    },
    chip: {
        // color: theme.palette.common.black,
        margin: theme.spacing(0, 1, 1, 0),
    },
}));

export default function DetailsLeftProfile() {
    const [data] = useTeacherDetailsData();
    const classes = useStyles();
    const handleError = useHandleError();

    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const handleButtonOpen = () => {
        setOpenEditDialog(true);
    };

    return (
        <>
            <Paper className={classes.rootCard}>
                <div className={classes.headerCard}>
                    <Typography className={classes.headerTypo} variant={'h4'}>
                        <Translate root={'teachers/[id]'}>{'details.contactDetails'}</Translate>
                    </Typography>
                    {/*<IconButton onClick={handleButtonOpen}>*/}
                    {/*    <img alt={'Edit Icon'} src={EditIcon} />*/}
                    {/*</IconButton>*/}
                </div>
                <div className={classes.contentCard}>
                    <Typography variant={'caption'}>
                        <Translate root={'teachers/[id]'}>{'details.number'}</Translate>
                    </Typography>
                    <Typography variant={'h6'}>{data && data.phone}</Typography>
                </div>
                <Divider />
                <div className={classes.contentCard}>
                    <Typography variant={'caption'}>
                        <Translate root={'teachers/[id]'}>{'details.email'}</Translate>
                    </Typography>
                    <Typography variant={'h6'}>{data && data.email}</Typography>
                </div>
                <Divider />
                <div className={classes.contentCard}>
                    <Typography variant={'caption'}>
                        <Translate root={'teachers/[id]'}>{'details.address'}</Translate>
                    </Typography>
                    <Typography variant={'h6'}>{data && data.address}</Typography>
                </div>
            </Paper>
            {/*<Box mt={3} />*/}
            {/*<Paper className={classes.rootCard}>*/}
            {/*    <div className={classes.headerCard}>*/}
            {/*        <Typography className={classes.headerTypo} variant={'h4'}>*/}
            {/*            <Translate>{'teacher.details.coursesTeach'}</Translate>*/}
            {/*        </Typography>*/}
            {/*        <IconButton>*/}
            {/*            <img src={EditIcon} />*/}
            {/*        </IconButton>*/}
            {/*    </div>*/}
            {/*    <div className={classes.contentCard}>*/}
            {/*        {data && data.coursesTeach.length ? (*/}
            {/*            data.coursesTeach.map((each) => (*/}
            {/*                <Chip className={classes.chip} key={each} label={each} size={'small'} />*/}
            {/*            ))*/}
            {/*        ) : (*/}
            {/*            <Typography variant={'h5'}>*/}
            {/*                <Translate>{'teacher.details.coursesTeachEmpty'}</Translate>*/}
            {/*            </Typography>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*</Paper>*/}
            {/*<Box mt={3} />*/}
            {/*<Paper className={classes.rootCard}>*/}
            {/*    <div className={classes.headerCard}>*/}
            {/*        <Typography className={classes.headerTypo} variant={'h4'}>*/}
            {/*            <Translate>{'teacher.details.subjectsTeach'}</Translate>*/}
            {/*        </Typography>*/}
            {/*        <IconButton>*/}
            {/*            <img src={EditIcon} />*/}
            {/*        </IconButton>*/}
            {/*    </div>*/}
            {/*    <div className={classes.contentCard}>*/}
            {/*        {data && data.subjectsTeach.length ? (*/}
            {/*            data.subjectsTeach.map((each) => (*/}
            {/*                <Chip className={classes.chip} key={each} label={each} size={'small'} />*/}
            {/*            ))*/}
            {/*        ) : (*/}
            {/*            <Typography variant={'h5'}>*/}
            {/*                <Translate>{'teacher.details.subjectsTeachEmpty'}</Translate>*/}
            {/*            </Typography>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*</Paper>*/}
            <TeacherEditContactDetails
                onProfile={true}
                open={openEditDialog}
                setOpen={setOpenEditDialog}
                teacherEditData={data}
            />
        </>
    );
}
