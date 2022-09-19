import React from 'react';
import Box from '@material-ui/core/Box';
import Image from '../../../public/Frame.png';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

const useStyle = makeStyles(() => ({
    image: {
        width: 'auto',
        height: '250px',
    },
}));

const PendingComponent = ({ liveClassData, data, loading }) => {
    const hour = Math.floor(data?.duration / 60);
    const minute = data?.duration % 60;
    const classes = useStyle();
    return (
        <Paper
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%' }}
        >
            {/*<Box alignItems={'center'} display={'flex'} justifyContent={'center'} p={2}>*/}
            <Box alignItems={'center'} display={'flex'} flexDirection={'column'} justifyContent={'center'} p={2}>
                <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                    <img alt={'Logo Img'} className={classes.image} src={Image} />
                </Box>
                <Box alignItems={'center'} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                    <Typography component={Box} mt={3} variant={'body2'}>
                        {'Live Class'}
                    </Typography>
                    <Typography component={Box} mt={1} variant={'h3'}>
                        {liveClassData?.status === 4 ? 'Completed !!!' : 'Not Started yet'}
                    </Typography>
                </Box>
                <Box mt={3} />
                <Grid container spacing={0}>
                    <Grid item md={6} sm={12} style={{ backgroundColor: '#F3F3F3' }} xs={12}>
                        <Box display={'flex'} flexDirection={'column'} p={1}>
                            <Typography variant={'caption'}>{'Class On'}</Typography>
                            <Typography component={Box} variant={'h4'}>
                                {data?.topic || 'NA'}
                            </Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'column'} p={1}>
                            <Typography variant={'caption'}>{'Teacher'}</Typography>
                            <Typography component={Box} variant={'h4'}>
                                {liveClassData?.teacher?.name}
                            </Typography>
                        </Box>
                        {liveClassData?.status !== 1 && (
                            <Box display={'flex'} flexDirection={'column'} p={1}>
                                <Typography variant={'caption'}>{'Joined Attendee'}</Typography>
                                <Typography component={Box} variant={'h4'}>
                                    {data?.joinedAttendees || '0'}
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                    <Grid item md={6} sm={12} style={{ backgroundColor: '#F3F3F3' }} xs={12}>
                        <Box display={'flex'} flexDirection={'column'} p={1}>
                            <Typography variant={'caption'}>{'Expected Attendee'}</Typography>
                            <Typography component={Box} variant={'h4'}>
                                {data?.expectedAttendees || '0'}
                            </Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'column'} p={1}>
                            <Typography variant={'caption'}>{'Duration'}</Typography>
                            <Typography component={Box} variant={'h4'}>
                                {'0' + hour + ':' + minute + '  hour'}
                            </Typography>
                        </Box>
                        {liveClassData?.status !== 1 && (
                            <>
                                <Box display={'flex'} flexDirection={'column'} p={1}>
                                    <Typography variant={'caption'}>{'Questions'}</Typography>
                                    <Typography component={Box} variant={'h4'}>
                                        {data?.questions || '0'}
                                    </Typography>
                                </Box>
                                <Box display={'flex'} flexDirection={'column'} p={1}>
                                    <Typography variant={'caption'}>{'Chats'}</Typography>
                                    <Typography component={Box} variant={'h4'}>
                                        {data?.chats || '0'}
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </Grid>
                </Grid>
                {/*<Box bgcolor={'#F3F3F3'} display={'flex'} flexDirection={'column'} mt={3} p={2}>*/}
                {/*    <Box display={'flex'} p={1}>*/}
                {/*        <Typography variant={'body2'}>{'Class On :'}</Typography>*/}
                {/*        <Typography component={Box} ml={2} variant={'body2'}>*/}
                {/*            {data?.topic}*/}
                {/*        </Typography>*/}
                {/*    </Box>*/}
                {/*    <Box alignItems={'center'} display={'flex'} justifyContent={'center'} p={1}>*/}
                {/*        <Typography variant={'body2'}>{'Teacher :'}</Typography>*/}
                {/*        <Avatar alt="Name" component={Box} ml={2} src={liveClassData?.teacher?.avatar}>*/}
                {/*            {liveClassData?.teacher?.name.charAt(0)}*/}
                {/*        </Avatar>*/}
                {/*        <Typography component={Box} ml={1} variant={'body2'}>*/}
                {/*            {liveClassData?.teacher?.name}*/}
                {/*        </Typography>*/}
                {/*    </Box>*/}
                {/*    <Box display={'flex'} p={1}>*/}
                {/*        <Typography variant={'body2'}>{'Joined Attendee :'}</Typography>*/}
                {/*        <Typography component={Box} ml={2} variant={'body2'}>*/}
                {/*            {data?.joinedAttendees || '0'}*/}
                {/*        </Typography>*/}
                {/*    </Box>*/}
                {/*    <Box display={'flex'} p={1}>*/}
                {/*        <Typography variant={'body2'}>{'Expected Attendee :'}</Typography>*/}
                {/*        <Typography component={Box} ml={2} variant={'body2'}>*/}
                {/*            {data?.expectedAttendees || '0'}*/}
                {/*        </Typography>*/}
                {/*    </Box>*/}
                {/*    <Box display={'flex'} p={1}>*/}
                {/*        <Typography variant={'body2'}>{'Duration :'}</Typography>*/}
                {/*        <Typography component={Box} ml={2} variant={'body2'}>*/}
                {/*            {hour + ':' + minute + '  hour'}*/}
                {/*        </Typography>*/}
                {/*    </Box>*/}
                {/*    <Box display={'flex'} p={1}>*/}
                {/*        <Typography variant={'body2'}>{'Questions :'}</Typography>*/}
                {/*        <Typography component={Box} ml={2} variant={'body2'}>*/}
                {/*            {data?.questions || '0'}*/}
                {/*        </Typography>*/}
                {/*    </Box>*/}
                {/*    <Box display={'flex'} p={1}>*/}
                {/*        <Typography variant={'body2'}>{'Chats :'}</Typography>*/}
                {/*        <Typography component={Box} ml={2} variant={'body2'}>*/}
                {/*            {data?.chats || '0'}*/}
                {/*        </Typography>*/}
                {/*    </Box>*/}
                {/*</Box>*/}
            </Box>
            {/*</Box>*/}
        </Paper>
    );
};
export default PendingComponent;
