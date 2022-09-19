import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import ImageBackground from '../../../public/background_profile.svg';
import { Paper, Typography } from '@material-ui/core/index';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import StudentIcon from '../../../public/Group 605.png';
import BatchIcon from '../../../public/%.png';
import PolygonIcon from '../../../public/live classes unselected (2).svg';
import BatchesIcon from '../../../public/Group 733.png';

const useStyles = makeStyles((theme) => ({
    coverImage: {
        width: '100%',
        height: 90,
        objectFit: 'cover',
    },
    avatarProfile: {
        width: 180,
        height: 180,
        marginTop: theme.spacing(-1 * 10),
        marginLeft: theme.spacing(0.5),
        border: '3px solid white',
        background: 'white',
    },
    buttonProfile: {
        height: 45,
        minWidth: 100,
        marginLeft: theme.spacing(1),
        padding: theme.spacing(0, 2),
    },
    typoProfile: {
        textTransform: 'capitalize',
    },
    typo: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 2,
    },
    mainCard: {
        background: theme.palette.primary.main,
        height: '70px',
        width: '70px',
        borderRadius: 5,
    },
}));

export default function TopHeaderOfBatch({ batchDetails }) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const card = [
        {
            img: StudentIcon,
            title: 'Average score',
            count: '20',
            href: '/students',
        },
        {
            img: BatchIcon,
            title: 'Average Attendance',
            count: '30',
            href: '/institute/batch',
        },
        {
            img: PolygonIcon,
            title: 'Total live classes',
            count: '100',
            href: '/institute/batch',
        },
        {
            img: BatchesIcon,
            title: 'Exams conducted',
            count: '90',
            href: '/all-live-class',
        },
    ];
    return (
        <Box borderRadius={4} display="flex" flexDirection="column">
            <Paper>
                <img alt={'background-image'} className={classes.coverImage} src={ImageBackground} />
                <Box display="flex" flexDirection={'column'} p={2}>
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Typography variant={'h4'}>{batchDetails?.name}</Typography>
                        <Box display={'flex'}>
                            <Typography variant={'caption'}>{'Total seats :'}</Typography>
                            <Typography variant={'caption'}>{batchDetails?.totalSeatCount || '0'}</Typography>
                            <Box ml={1} />
                            {'-'}
                            <Box mr={1} />
                            <Typography variant={'caption'}>{'Acquired seats :'}</Typography>
                            <Typography variant={'caption'}>{batchDetails?.acquiredSeatCount || '0'}</Typography>
                        </Box>
                    </Box>
                    <Box display={'flex'} mt={2}>
                        <Typography variant={'body2'}>{'Course :'}</Typography>
                        <Typography className={classes.typo} variant={'caption'}>
                            {batchDetails?.instituteCourse?.name}
                        </Typography>
                    </Box>
                    <Box display={'flex'} mt={2}>
                        <Typography variant={'body2'}>{'Price :'}</Typography>
                        <Typography className={classes.typo} variant={'caption'}>
                            {batchDetails?.price || '0'}
                        </Typography>
                    </Box>
                </Box>
                <Grid container spacing={2} style={{ padding: 15 }}>
                    {card.map((each) => (
                        <Grid item key={each.title} md={3} sm={6} xs={12}>
                            <Paper
                                // onClick={() => {
                                //     goToTHePage(each);
                                // }}
                                style={{ cursor: 'pointer', backgroundColor: '#F3F3F3' }}
                            >
                                <Box display={'flex'} p={1}>
                                    <div
                                        className={classes.mainCard}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <img alt={'each.img'} className={classes.img} src={each.img} />
                                    </div>
                                    <Box m={1}>
                                        <Box>
                                            <Typography color={'textSecondary'} style={{ fontWeight: 500 }}>
                                                {each.title}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            {each?.count ? (
                                                <Typography style={{ fontWeight: 700, fontSize: '22px' }}>
                                                    {each.count}
                                                </Typography>
                                            ) : loading ? (
                                                <Skeleton animation="wave" />
                                            ) : (
                                                <Typography style={{ fontWeight: 700, fontSize: '22px' }}>
                                                    {'0'}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
}

// TopHeaderProfile.propTypes = {
//     institute: PropTypes.object.isRequired,
// };
