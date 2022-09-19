import React, { useState } from 'react';
// import Button from '@material-ui/core/Button';
import Translate from '../../../src/components/Translate';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import LiveClassSkeleton from '../../../src/components/Skeleton/LiveClassSkeleton';
import Button from '@material-ui/core/Button';
import Image from '../../../public/Demo picture (1).png';
import Card from '@material-ui/core/Card';

const useStyles = makeStyles((theme) => ({
    buttonDiv: {
        fontWeight: 500,
        fontSize: 13,
    },
    switchButtonIcon: {
        marginLeft: theme.spacing(1),
        color: theme.palette.primary.main,
    },
    mainDiv: {
        marginTop: theme.spacing(3),
    },
    coverImage: {
        width: '100%',
        objectFit: 'cover',
    },
}));

const AllSyllabus = ({ id, batchDetails }) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);

    return (
        <React.Fragment>
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant={'h3'}>
                            <Translate root={'batch-details/[batchDetailsById]'}>{'title'}</Translate>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            {batchDetails?.syllabuses?.length ? (
                <div className={classes.mainDiv}>
                    <Grid container spacing={2}>
                        {batchDetails?.syllabuses?.map((each, index) => {
                            return (
                                <>
                                    <Grid item md={3} sm={3} xs={3}>
                                        <Card>
                                            <img alt={'background-image'} className={classes.coverImage} src={Image} />
                                            <Box
                                                alignItems={'center'}
                                                display={'flex'}
                                                flexDirection={'column'}
                                                justifyContent={'center'}
                                                p={1.5}
                                            >
                                                <Typography>{each.name}</Typography>
                                                <Button
                                                    color={'primary'}
                                                    fullWidth
                                                    href={`/batch-videos/${each._id}?batch=${id}`}
                                                    size={'small'}
                                                    style={{ marginTop: 5 }}
                                                    variant={'contained'}
                                                >
                                                    <Translate root={'institute/batch'}>{'View Progress'}</Translate>
                                                </Button>
                                            </Box>
                                        </Card>
                                    </Grid>
                                </>
                            );
                        })}
                    </Grid>
                </div>
            ) : loading ? (
                <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                    <LiveClassSkeleton />
                </Box>
            ) : (
                <Translate root={'batch-details/[batchDetailsById]'}>{'No Syllabus Found'}</Translate>
            )}
        </React.Fragment>
    );
};

export default AllSyllabus;
