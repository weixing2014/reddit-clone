import useUser from '@/hooks/useUser';
import { Flex, Image } from '@chakra-ui/react';
import { FieldValue, Timestamp } from 'firebase/firestore';
import React from 'react';

export type CommentData = {
  id?: string;
  creatorId: string;
  creatorDisplayText: string | null;
  postId: string;
  text: string | null;
  createdAt: Timestamp | FieldValue;
};

function Comment({ comment }: { comment: CommentData }) {
  const { loading, user, error } = useUser(comment.creatorId);

  return (
    <Flex key={comment.id} direction='row' pt={1} pb={1}>
      <Flex pr={2}>
        <Image boxSize='1.5rem' borderRadius={999} src={user?.photoURL} alt='avatar' />
      </Flex>
      <Flex direction='column'>
        <Flex color='gray.500' fontSize='9pt' fontWeight='700' flexGrow={1}>
          {comment.creatorDisplayText}
        </Flex>
        <Flex color='gray.500' fontSize='9pt' flexGrow={1}>
          {comment.text}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Comment;
