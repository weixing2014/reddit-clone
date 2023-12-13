import usePosts from '@/hooks/usePosts';
import { CommunityData } from '@/redux/appSlice';
import { Spinner, Stack } from '@chakra-ui/react';
import Post from './Post';
import { auth } from '@/firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';

function Posts({ communityData }: { communityData: CommunityData }) {
  const [user] = useAuthState(auth);
  const { loading, error, currentPosts, deletePost } = usePosts(communityData.id, user?.uid);

  return (
    <>
      {loading ? (
        <Stack direction='row' spacing={4} justify='center'>
          <Spinner size='xl' />
        </Stack>
      ) : (
        currentPosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            isUserCreator={user?.uid === communityData.creatorId}
            handleDeletePost={deletePost}
          />
        ))
      )}
    </>
  );
}

export default Posts;
