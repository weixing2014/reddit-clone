import { auth } from '@/firebase/clientApp';
import { setAuthModalState } from '@/redux/appSlice';
import { Flex, Icon, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaReddit } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

function CreatePostLink() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);

  return (
    <Flex
      bgColor='white'
      padding='10px'
      justify='center'
      borderRadius='4px'
      border='1px solid'
      borderColor='gray.300'
    >
      <Icon as={FaReddit} fontSize={36} color='gray.300' mr={2} mt='1px' />
      <Input
        placeholder='Create Post'
        onClick={() => {
          if (!user) {
            dispatch(setAuthModalState({ open: true, view: 'login' }));
            return;
          }
          const { communityId } = router.query;
          router.push(`/r/${communityId}/submit`);
        }}
      />
    </Flex>
  );
}

export default CreatePostLink;
