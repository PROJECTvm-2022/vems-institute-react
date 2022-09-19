/**
 *
 * @createdBy Ramakanta Kar
 * @email ramakantakar1997@gmail.com
 * @description Teachers
 * @createdOn 29/01/21 08:25 PM
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CommentsService } from '../../apis/rest.app';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Translate from '../../../src/components/Translate';
import InfiniteScroll from 'react-infinite-scroller';
import Avatar from '@material-ui/core/Avatar';
import { useUser } from '../../store/UserContext';
import TextField from '@material-ui/core/TextField';
import { useLanguage } from '../../store/LanguageStore';
import { Button } from '@material-ui/core/index';
import CommentRow from './CommentRow';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import QuillEditor from '../../components/QuillComponents/QuillEditor';

const BootstrapInput = withStyles((theme) => ({
    input: {
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
        border: '1px solid #ced4da',
        fontSize: 14,
        padding: theme.spacing(0.2, 0.5),
    },
}))(InputBase);

const useStyle = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    eachBox: {
        cursor: 'pointer',
    },
    avatarSelf: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
    formControl: {
        minWidth: 60,
    },
}));

const CommentComponent = ({ video }) => {
    const classes = useStyle();
    const [comments, setComments] = useState([]);
    const [user] = useUser();
    const [hasMore, setHasMore] = useState(true);
    const Language = useLanguage('video/[videoId]');
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState('');
    const [type, setType] = useState('1');
    const [loading, setLoading] = useState(false);

    const LoadComments = () => {
        CommentsService.find({
            query: {
                $skip: comments.length,
                entityId: video._id,
                $limit: 12,
                '$sort[createdAt]': -1,
                $populate: ['createdBy'],
                type: 1,
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
                    entityType: 'instituteBatchVideo',
                    entityId: video._id,
                    parentEntityType: 'video',
                    parentEntityId: '',
                    type,
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
        <Box className={classes.root}>
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
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <FormControl className={classes.formControl} variant={'outlined'}>
                            <Select
                                input={<BootstrapInput />}
                                onChange={(event) => setType(event.target.value)}
                                value={type}
                            >
                                <MenuItem value={'1'}>Public</MenuItem>
                                <MenuItem value={'2'}>Private</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            color={'primary'}
                            disabled={loading}
                            onClick={AddComment}
                            size={'small'}
                            variant={'contained'}
                        >
                            {loading ? <CircularProgress size={17} /> : Language.get('comment_add_button')}
                        </Button>
                    </Box>
                </Box>
            </Box>
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
                {comments && comments.length ? (
                    comments.map((each) => <CommentRow each={each} key={each._id} />)
                ) : hasMore ? (
                    ''
                ) : (
                    <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center">
                        <Translate root={'video/[videoId]'}>{'no_comments'}</Translate>
                    </Box>
                )}
            </InfiniteScroll>
        </Box>
    );
};
CommentComponent.propTypes = {
    video: PropTypes.object.isRequired,
};
export default CommentComponent;
