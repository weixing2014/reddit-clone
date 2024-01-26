import { updateUserVotedPostAsync } from '@/firebase/api/api';
import { auth } from '@/firebase/clientApp';
import * as reduxStore from '@/redux/appSlice';
import { Post, setAuthModalState } from '@/redux/appSlice';
import { Flex, Icon, Image, Spinner, Text } from '@chakra-ui/react';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BiDownvote, BiSolidDownvote, BiSolidUpvote, BiUpvote } from 'react-icons/bi';
import { FaRegCommentAlt } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import Comments from './Comments';
import { convertTimestampToFromNowText } from '@/utils/timestamp';

type Props = {
  post: Post;
  handleDeletePost?: (post: Post) => void;
};

export type VoteAction = 'UP' | 'DOWN';

const currentMoment = moment();

function Post({ post, handleDeletePost }: Props) {
  const [user] = useAuthState(auth);
  const [deletePostLoading, setDeletePostLoading] = useState(false);
  const dispatch = useDispatch();
  const userVotedPosts = useSelector(reduxStore.selectUserVotedPosts);
  const currentUserVoteValue = useSelector(
    reduxStore.selectVoteValueByUserIdAndPostId(user?.uid, post.id)
  );

  const getValueDelta = (action: VoteAction) => {
    if (!user) return;

    const mappings: { [key: number]: { [key in VoteAction]: number } } = {
      1: {
        UP: -1,
        DOWN: -2,
      },
      0: {
        UP: 1,
        DOWN: -1,
      },
      [-1]: {
        UP: 2,
        DOWN: 1,
      },
    };

    return mappings[currentUserVoteValue > 0 ? 1 : currentUserVoteValue < 0 ? -1 : 0][action] || 0;
  };

  const updateUserVote = async (action: VoteAction) => {
    if (!user) {
      dispatch(setAuthModalState({ open: true, view: 'login' }));
      return;
    }

    const valueDelta = getValueDelta(action)!;

    try {
      await updateUserVotedPostAsync(user.uid, post.id!, valueDelta);
    } catch (e) {
      console.log('e :>> ', e);
    }

    dispatch(
      reduxStore.updateUserPostVoteValue({
        postId: post.id!,
        valueDelta,
      })
    );
  };

  return (
    <Flex key={post.id} bgColor='white' borderRadius={4} mt={2}>
      <Flex
        width='60px'
        bgColor='gray.50'
        flexDirection='column'
        alignItems='center'
        flexShrink={0}
        p={2}
      >
        <Icon
          ml='-1px'
          as={currentUserVoteValue === 1 ? BiSolidUpvote : BiUpvote}
          _hover={{ cursor: 'pointer' }}
          onClick={async () => {
            await updateUserVote('UP');
          }}
        />
        {post.voteStatus}
        <Icon
          ml='-1px'
          as={currentUserVoteValue === -1 ? BiSolidDownvote : BiDownvote}
          _hover={{ cursor: 'pointer' }}
          onClick={async () => {
            await updateUserVote('DOWN');
          }}
        />
      </Flex>
      <Flex width='100%' direction='column' p={2}>
        <Flex>
          <Text color='gray.500' fontSize='10pt'>
            Posted by u/{post.creatorDisplayName} {convertTimestampToFromNowText(post.createdAt)}
          </Text>
        </Flex>
        <Flex pt={1}>
          <Text fontSize='16pt' fontWeight='600'>
            {post.title}
          </Text>
        </Flex>
        <Flex>{post.body}</Flex>
        {post.imageURL && (
          <Flex>
            <Image src={post.imageURL} alt='Post image' />
          </Flex>
        )}
        <Flex
          direction='row'
          alignItems='center'
          color='gray.500'
          fontWeight='600'
          fontSize='10pt'
          mt={2}
        >
          <Flex>
            <Icon fontSize='12pt' mr={1} as={FaRegCommentAlt} mt='2px' />
            {post.numberOfComments} Comments
          </Flex>
          {user?.uid &&
            handleDeletePost &&
            post.creatorId === user?.uid &&
            (deletePostLoading ? (
              <Flex ml={2}>
                <Spinner size='xs' ml={2} mr={2} mt={1} />
                Deleting
              </Flex>
            ) : (
              <Flex
                ml={2}
                _hover={{ cursor: 'pointer' }}
                onClick={async () => {
                  try {
                    setDeletePostLoading(true);
                    await handleDeletePost(post);
                  } catch (e: any) {
                    console.log('Delete post error :>> ', e.message);
                  }

                  setDeletePostLoading(false);
                }}
              >
                <Icon fontSize='12pt' mr={1} as={RiDeleteBinLine} mt='2px' />
                Delete
              </Flex>
            ))}
        </Flex>
        <Flex>
          <Comments user={user} post={post} />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Post;
