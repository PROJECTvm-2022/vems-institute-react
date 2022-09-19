import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CommentsService } from '../../apis/rest.app';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Translate from '../../../src/components/Translate';
import InfiniteScroll from 'react-infinite-scroller';
import Avatar from '@material-ui/core/Avatar';
import { useLanguage } from '../../store/LanguageStore';
import { Button } from '@material-ui/core/index';
import moment from 'moment';
import PropTypes from 'prop-types';
import QuillViewer from '../../components/QuillComponents/QuillViewer ';
import QuillEditor from '../../components/QuillComponents/QuillEditor';
import { useUser } from '../../store/UserContext';

const useStyle = makeStyles((theme) => ({
    replyButton: {
        width: 'max-content',
        fontSize: 12,
    },
    avatarSelf: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
}));

const CommentListItem = ({ each }) => {
    const classes = useStyle();
    const [user] = useUser();
    const [replyOpen, setReplyOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const Language = useLanguage('teacher-video-details/details/[videoId]');
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState('');
    const [loading, setLoading] = useState(false);

    const LoadReplies = () => {
        CommentsService.find({
            query: {
                $skip: comments.length,
                entityId: each._id,
                parentEntityType: 'instituteBatchVideo',
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
    const AddComment = () => {
        if (comment.trim() === '') {
            setCommentError(Language.get('comment_error'));
        } else {
            setCommentError('');
            setLoading(true);
            CommentsService.create(
                {
                    comment,
                    entityType: 'comment',
                    entityId: each._id,
                },
                {
                    query: {
                        $populate: ['createdBy'],
                    },
                },
            )
                .then((response) => {
                    const result = [response, ...comments];
                    setComments([...result]);
                    setComment('');
                })
                .catch(() => {
                    setHasMore(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    return (
        <Box display={'flex'} mb={2} mt={2} width={'100%'}>
            <Avatar
                className={classes.avatarSelf}
                src={
                    each.createdBy.avatar
                        ? each.createdBy.avatar
                        : each.createdBy.institutes
                        ? each.createdBy.institutes[0].institute.logo
                        : ''
                }
            />
            <Box display={'flex'} flexDirection={'column'} ml={2} width={'100%'}>
                <Box alignItems="center" display={'flex'}>
                    <Typography>{each?.createdBy?.name || 'Unknown User'}</Typography>
                    <Box color="text.secondary" fontSize={12} ml={1}>
                        {moment(each.createdAt).fromNow()}
                    </Box>
                </Box>
                <QuillViewer html={each.comment} />
                {/*<Box color="text.secondary" fontSize={16}>*/}
                {/*    {each.comment}*/}
                {/*</Box>*/}
                <Button
                    className={classes.replyButton}
                    color={'primary'}
                    onClick={() => {
                        if (!replyOpen) {
                            setReplyOpen(!replyOpen);
                            setComments([]);
                            setHasMore(true);
                        } else {
                            setReplyOpen(!replyOpen);
                        }
                    }}
                >
                    {replyOpen ? Language.get('labels.hideReplay') : Language.get('labels.viewReplay')}
                </Button>
                {replyOpen && (
                    <>
                        <Box alignItems={'center'} display={'flex'} mb={2} mt={2} width={'100%'}>
                            <Avatar
                                className={classes.avatarSelf}
                                src={user.avatar ? user.avatar : user.role === 128 ? user.institute.logo : ''}
                            />
                            <Box display={'flex'} flexDirection={'column'} ml={2} width={'100%'}>
                                <QuillEditor
                                    onChange={(value) => {
                                        setComment(value);
                                    }}
                                    value={comment}
                                />
                                <Box mt={1} />
                                <Box display={'flex'} justifyContent={'flex-end'}>
                                    <Button
                                        color={'primary'}
                                        disabled={loading}
                                        onClick={AddComment}
                                        size={'small'}
                                        variant={'contained'}
                                    >
                                        {loading ? <CircularProgress size={17} /> : Language.get('Add Reply')}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                        <InfiniteScroll
                            hasMore={hasMore}
                            loadMore={LoadReplies}
                            loader={
                                <Box align={'center'} key={'all-teacher'} p={2}>
                                    <CircularProgress size={28} />
                                </Box>
                            }
                            pageStart={0}
                        >
                            {comments.map((each) => (
                                <CommentListItem each={each} key={each._id} />
                            ))}
                            {!hasMore && !comments.length && (
                                <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center">
                                    <Translate root={'teacher-video-details/details/[videoId]'}>
                                        {'messages.noReplay'}
                                    </Translate>
                                </Box>
                            )}
                        </InfiniteScroll>
                    </>
                )}
            </Box>
        </Box>
    );
};

CommentListItem.propTypes = {
    each: PropTypes.object.isRequired,
};
export default CommentListItem;
