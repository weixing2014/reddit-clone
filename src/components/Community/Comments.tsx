import { Post } from '@/redux/appSlice';
import { Flex, Input, Image } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';

export type Comment = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  postId: string;
  text: string;
  createdAT: Timestamp;
};

function Comments({ user, post }: { user?: User | null; post: Post }) {
  const [commentText, setCommentText] = useState('');
  return (
    <Flex direction='column'>
      <Flex bgColor='white' pt={2} justify='center' borderColor='gray.300'>
        <Input placeholder='Add your comment' onClick={() => {}} />
      </Flex>
      <Flex direction='row' pt={1} pb={1}>
        <Flex pr={2}>
          <Image boxSize='1.5rem' borderRadius='2px' src={''} alt='avatar' />
        </Flex>
        <Flex color='gray.500' fontSize='10pt' flexGrow={1}>
          This is my comment This is my comment This is my comment This is my comment
        </Flex>
      </Flex>
      <Flex direction='row' pt={1} pb={1}>
        <Flex pr={2}>
          <Image boxSize='1.5rem' borderRadius='2px' src={''} alt='avatar' />
        </Flex>
        <Flex color='gray.500' fontSize='10pt' flexGrow={1}>
          This is my comment This is my comment This is my comment This is my comment
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Comments;
