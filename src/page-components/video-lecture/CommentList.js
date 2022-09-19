import React, { useState } from 'react';
import { CommentsService } from '../../apis/rest.app';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Translate from '../../../src/components/Translate';
import InfiniteScroll from 'react-infinite-scroller';
import CommentListItem from './CommentListItem';
import PropTypes from 'prop-types';

const CommentList = ({ entityId, entityType }) => {
    const [comments, setComments] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const LoadComments = () => {
        CommentsService.find({
            query: {
                $skip: comments.length,
                entityId,
                entityType,
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

    return (
        <Box displa="flex" flexDirection="column">
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
                        <Translate root={'video-lecture/details/[videoId]'}>{'messages.noComments'}</Translate>
                    </Box>
                )}
            </InfiniteScroll>
        </Box>
    );
};

CommentList.propTypes = {
    entityId: PropTypes.string.isRequired,
    entityType: PropTypes.string.isRequired,
};

export default CommentList;
