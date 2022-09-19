import React, { useState } from 'react';
import { CommentsService } from '../../apis/rest.app';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Translate from '../../../src/components/Translate';
import InfiniteScroll from 'react-infinite-scroller';
import CommentListItem from './CommentListItem';
import PropTypes from 'prop-types';
// import Avatar from '@material-ui/core/Avatar';
// import QuillEditor from '../../components/QuillComponents/QuillEditor';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
// import { Button } from '@material-ui/core/index';
// import withStyles from '@material-ui/core/styles/withStyles';
// import InputBase from '@material-ui/core/InputBase';
// import { makeStyles } from '@material-ui/core/styles';
// import { useUser } from '../../store/UserContext';
// import { useLanguage } from '../../store/LanguageStore';

// const BootstrapInput = withStyles((theme) => ({
//     input: {
//         borderRadius: 4,
//         backgroundColor: '#E0E0E0',
//         border: '1px solid #ced4da',
//         fontSize: 14,
//         padding: theme.spacing(0.2, 0.5),
//     },
// }))(InputBase);
//
// const useStyle = makeStyles((theme) => ({
//     root: {
//         display: 'flex',
//         flexDirection: 'column',
//         width: '100%',
//     },
//     eachBox: {
//         cursor: 'pointer',
//     },
//     avatarSelf: {
//         width: theme.spacing(5),
//         height: theme.spacing(5),
//     },
//     formControl: {
//         minWidth: 60,
//     },
// }));

const AllCommentList = ({ parentEntityId }) => {
    // const classes = useStyle();
    // const [user] = useUser();
    const [comments, setComments] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    // const Language = useLanguage('video/[videoId]');
    // const [comment, setComment] = useState('');
    // const [commentError, setCommentError] = useState('');
    // const [type, setType] = useState('1');
    // const [loading, setLoading] = useState(false);

    const LoadComments = () => {
        CommentsService.find({
            query: {
                $skip: comments.length,
                parentEntityId,
                $sort: {
                    createdAt: -1,
                },
                $populate: ['createdBy'],
            },
        })
            .then((response) => {
                const { data, total } = response;
                const result = [...comments, ...data];
                setHasMore(result.length < total);
                setComments(result);
            })
            .catch(() => {
                setHasMore(false);
            });
    };

    // const AddComment = () => {};

    return (
        <Box displa="flex" flexDirection="column">
            {/*<Box alignItems={'center'} display={'flex'} mb={2} mt={2} width={'100%'}>*/}
            {/*    <Avatar*/}
            {/*        className={classes.avatarSelf}*/}
            {/*        src={user.avatar ? user.avatar : user.role === 128 ? user.institute.logo : ''}*/}
            {/*    />*/}
            {/*    <Box display={'flex'} flexDirection={'column'} ml={2} width={'100%'}>*/}
            {/*        <QuillEditor*/}
            {/*            onChange={(value) => {*/}
            {/*                setComment(value);*/}
            {/*            }}*/}
            {/*            value={comment}*/}
            {/*        />*/}
            {/*        <Box mt={1} />*/}
            {/*        <Box display={'flex'} justifyContent={'space-between'}>*/}
            {/*            <FormControl className={classes.formControl} variant={'outlined'}>*/}
            {/*                <Select*/}
            {/*                    input={<BootstrapInput />}*/}
            {/*                    onChange={(event) => setType(event.target.value)}*/}
            {/*                    value={type}*/}
            {/*                >*/}
            {/*                    <MenuItem value={'1'}>Public</MenuItem>*/}
            {/*                    <MenuItem value={'2'}>Private</MenuItem>*/}
            {/*                </Select>*/}
            {/*            </FormControl>*/}
            {/*            <Button*/}
            {/*                color={'primary'}*/}
            {/*                disabled={loading}*/}
            {/*                onClick={AddComment}*/}
            {/*                size={'small'}*/}
            {/*                variant={'contained'}*/}
            {/*            >*/}
            {/*                {loading ? <CircularProgress size={17} /> : Language.get('Comment')}*/}
            {/*            </Button>*/}
            {/*        </Box>*/}
            {/*    </Box>*/}
            {/*</Box>*/}
            <InfiniteScroll
                hasMore={hasMore}
                loadMore={LoadComments}
                loader={
                    <Box align={'center'} key={'loader_comment'} p={2}>
                        <CircularProgress size={28} />
                    </Box>
                }
                pageStart={0}
            >
                {comments.map((each) => (
                    <CommentListItem each={each} key={each._id} />
                ))}
                {!hasMore && !comments.length && (
                    <Box display="flex" justifyContent="center">
                        <Translate root={'teacher-video-details/details/[videoId]'}>{'messages.noComments'}</Translate>
                    </Box>
                )}
            </InfiniteScroll>
        </Box>
    );
};

AllCommentList.propTypes = {
    parentEntityId: PropTypes.string.isRequired,
};

export default AllCommentList;
