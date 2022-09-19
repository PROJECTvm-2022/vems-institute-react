import React, { useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { MessageService } from '../../apis/rest.app';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';
import Image1 from '../../assets/1.svg';
import Image2 from '../../assets/2.svg';
import Image3 from '../../assets/3.svg';

const useStyles = makeStyles((theme) => ({
    allOption: {
        borderRadius: 6,
        border: `1px solid ${theme.palette.common.black}`,
    },
    skeleton: {
        height: '60px',
    },
    button: {
        fontSize: '10px',
        borderRadius: '20px',
        fontWeight: 500,
    },
    commonColor: {
        color: '#000',
    },
}));

const QuizCard = ({ each }) => {
    const classes = useStyles();
    const [students, setStudents] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const handleUpdate = () => {
        setLoading(true);
        setStudents([]);
        MessageService.find({
            query: {
                entityId: each?._id,
                $populate: ['createdBy'],
            },
        })
            .then((item) => {
                setStudents(item.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    console.log('students', students);

    useEffect(() => {
        handleUpdate();
    }, []);
    //
    // const Color = () => {
    //     console.log('kkk');
    //     return '#' + Math.floor(Math.random() * 16777215).toString(16);
    // };

    return (
        <React.Fragment>
            <Box display={'flex'}>
                <Box mb={2} mr={0.5}>
                    <Typography color={'textPrimary'} variant={'h4'}>
                        {`Q. `}
                    </Typography>
                </Box>
                <Box>
                    <Typography color={'textPrimary'} variant={'h4'}>
                        {each?.text}
                    </Typography>
                </Box>
            </Box>
            <Box width={'100%'}>
                <Typography color={'textSecondary'} variant={'body2'}>
                    {'Correct answer'}
                </Typography>
                <Box mt={1} />
                <Grid container spacing={3}>
                    {each?.options
                        ?.filter((e) => e?.name === each?.answerOfQuiz)
                        ?.map((item, index) => (
                            <Grid item key={item?._id} md={12} sm={12} xs={12}>
                                <Box
                                    borderRadius={18}
                                    className={classes.commonColor}
                                    display={'flex'}
                                    key={item._id}
                                    mb={1}
                                    p={1}
                                    style={
                                        item?.name === each?.answerOfQuiz
                                            ? { background: 'rgba(76,245,28,0.58)' }
                                            : { background: '#d4d4d4' }
                                    }
                                    width={'100%'}
                                >
                                    {index + 1 === 1 ? 'a)' : index + 1 === 2 ? 'b)' : index + 1 === 3 ? 'c)' : 'd)'}
                                    <Box className={classes.commonColor} ml={0.5}>
                                        {item?.name}
                                    </Box>
                                    <span style={{ flexGrow: 1 }} />
                                    <Box>
                                        <Typography className={classes.commonColor}>
                                            {Math.floor(
                                                (item?.supportCount /
                                                    each?.options?.reduce(
                                                        (accumulator, currentValue) =>
                                                            accumulator + currentValue.supportCount,
                                                        0,
                                                    )) *
                                                    100,
                                            ) || 0}{' '}
                                            %
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                </Grid>
                <Box display={'flex'} justifyContent={'space-between'} mb={2}>
                    <Box display={'flex'} my={1}>
                        <Box>
                            <Typography className={classes.commonColor}>{'Total attempts :'}</Typography>
                        </Box>
                        <Box ml={1} />
                        <Box className={classes.commonColor}>
                            {each?.options?.reduce(
                                (accumulator, currentValue) => accumulator + currentValue.supportCount,
                                0,
                            )}
                            {" student's"}
                        </Box>
                    </Box>
                    {/*<Box display={'flex'} my={1}>*/}
                    {/*    <Box>*/}
                    {/*        <Typography>{'Correct answer %:'}</Typography>*/}
                    {/*    </Box>*/}
                    {/*    <Box ml={1} />*/}
                    {/*    <Box mr={7}>*/}
                    {/*        {each?.options*/}
                    {/*            ?.filter((e) => e.name === each.answerOfQuiz)*/}
                    {/*            .map((item) => (*/}
                    {/*                <Box key={item._id}>*/}
                    {/*                    {Math.floor(*/}
                    {/*                        (item.supportCount /*/}
                    {/*                            each?.options?.reduce(*/}
                    {/*                                (accumulator, currentValue) =>*/}
                    {/*                                    accumulator + currentValue.supportCount,*/}
                    {/*                                0,*/}
                    {/*                            )) **/}
                    {/*                            100,*/}
                    {/*                    ) || 0}*/}
                    {/*                    {' %'}*/}
                    {/*                </Box>*/}
                    {/*            ))}*/}
                    {/*    </Box>*/}
                    {/*</Box>*/}
                    <Box display={'flex'} my={1}>
                        <Box>
                            <Typography className={classes.commonColor}>{'Duration :'}</Typography>
                        </Box>
                        <Box ml={1} />
                        <Box className={classes.commonColor} mr={5}>
                            {each?.duration?.toString().length === 1 ? `0${each?.duration}` : each?.duration} {' Sec'}
                        </Box>
                    </Box>
                </Box>
                {each?.status !== 2 && (
                    <>
                        <Box display={'flex'} justifyContent={'space-between'} mb={2}>
                            <Typography
                                className={classes.commonColor}
                                variant={'h4'}
                            >{`Students with Correct Answer (${
                                students?.filter((e) => e?.text === each?.answerOfQuiz).length
                            }/${students?.length})`}</Typography>
                            {/*</Tooltip>*/}
                        </Box>
                        <Grid container spacing={3}>
                            {students?.length ? (
                                students
                                    ?.filter((each1) => each1?.text === each?.answerOfQuiz)
                                    ?.map((e, i) => {
                                        let time = Math.floor(
                                            (new Date(e?.createdAt).getTime() -
                                                new Date(
                                                    each?.publishedAt ? each?.publishedAt : each?.createdAt,
                                                ).getTime()) /
                                                1000,
                                        );
                                        return (
                                            <>
                                                <Grid item key={e?._id} md={4} sm={6} xs={12}>
                                                    <Box key={e?._id}>
                                                        <Box display={'flex'}>
                                                            <Box className={classes.commonColor} width={'30px'}>
                                                                {i + 1 + '.'}
                                                            </Box>
                                                            {e?.text === each?.answerOfQuiz && (
                                                                <Box mr={1.5}>
                                                                    <img
                                                                        alt={'Image'}
                                                                        src={
                                                                            i === 0
                                                                                ? Image1
                                                                                : i === 1
                                                                                ? Image2
                                                                                : i === 3
                                                                                ? Image3
                                                                                : ''
                                                                            // students?.filter(
                                                                            //     (each2) =>
                                                                            //         each2?.text === each?.answerOfQuiz,
                                                                            // )[0]._id === e?._id
                                                                            //     ? // i === 0
                                                                            //       Image1
                                                                            //     : students?.filter(
                                                                            //           (each2) =>
                                                                            //               each2?.text ===
                                                                            //               each?.answerOfQuiz,
                                                                            //       )[1]._id === e?._id
                                                                            //     ? Image2
                                                                            //     : students?.filter(
                                                                            //           (each2) =>
                                                                            //               each2?.text ===
                                                                            //               each?.answerOfQuiz,
                                                                            //       )[1]._id === e?._id
                                                                            //     ? Image3
                                                                            //     : ''
                                                                        }
                                                                        style={{ width: '18px', height: 'auto' }}
                                                                    />
                                                                </Box>
                                                            )}

                                                            <Box display={'flex'} flexDirection={'column'}>
                                                                <Typography
                                                                    className={classes.commonColor}
                                                                    variant={'body1'}
                                                                >
                                                                    {e?.createdBy?.name}
                                                                </Typography>
                                                                {/*<Typography*/}
                                                                {/*    variant={'caption'}*/}
                                                                {/*>{`Answer: ${e?.text}`}</Typography>*/}
                                                            </Box>
                                                            {/*<Box*/}
                                                            {/*    alignItems={'center'}*/}
                                                            {/*    display={'flex'}*/}
                                                            {/*    justifyContent={'center'}*/}
                                                            {/*    ml={3}*/}
                                                            {/*    width={'40px'}*/}
                                                            {/*>*/}
                                                            {/*    <Typography variant={'caption'}>{`${time} Sec`}</Typography>*/}
                                                            {/*</Box>*/}
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                                <Grid item md={8} sm={6} xs={12}>
                                                    <Box display={'flex'}>
                                                        <Box
                                                            alignItems={'center'}
                                                            bgcolor={e?.text === each?.answerOfQuiz ? '#037FFB' : 'red'}
                                                            borderRadius={'6px 0px 0px 6px'}
                                                            // className={classes.commonColor}
                                                            display={'flex'}
                                                            height={14}
                                                            justifyContent={'flex-end'}
                                                            p={1}
                                                            style={{ fontSize: 10 }}
                                                            width={`${(time / each?.duration) * 100}%`}
                                                        >{`${time}sec`}</Box>
                                                        <Box
                                                            alignItems={'center'}
                                                            bgcolor={'#F3F3F3'}
                                                            borderRadius={'0px 6px 6px 0px'}
                                                            className={classes.commonColor}
                                                            display={'flex'}
                                                            height={14}
                                                            justifyContent={'flex-end'}
                                                            p={1}
                                                            style={{ fontSize: 10 }}
                                                            width={`${
                                                                ((each?.duration - time) / each?.duration) * 100
                                                            }%`}
                                                        >{`${each?.duration}sec`}</Box>
                                                    </Box>
                                                </Grid>
                                            </>
                                        );
                                    })
                            ) : loading ? (
                                <Box>
                                    <Skeleton className={classes.skeleton} />
                                    <Skeleton />
                                    <Skeleton className={classes.skeleton} />
                                    <Skeleton />
                                    <Skeleton className={classes.skeleton} />
                                    <Skeleton />
                                </Box>
                            ) : (
                                <Box
                                    alignItems={'center'}
                                    component={Typography}
                                    display={'flex'}
                                    justifyContent={'center'}
                                    ml={2}
                                    style={{ color: '#000' }}
                                    variant={'caption'}
                                >
                                    {'No Students Found'}
                                </Box>
                            )}
                        </Grid>
                        {/*</Collapse>*/}
                    </>
                )}
            </Box>
        </React.Fragment>
    );
};

QuizCard.propTypes = {
    each: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default QuizCard;
