import useUser from '@/hooks/useUser';
import { convertTimestampToFromNowText } from '@/utils/timestamp';
import { Flex, Image } from '@chakra-ui/react';
import { FieldValue, Timestamp } from 'firebase/firestore';
import moment from 'moment';
import React from 'react';

const currentMoment = moment();

export type CommentData = {
  id?: string;
  creatorId: string;
  creatorDisplayText: string | null;
  postId: string;
  text: string | null;
  createdAt: Timestamp;
};

function Comment({ comment }: { comment: CommentData }) {
  const { loading, user, error } = useUser(comment.creatorId);

  return (
    <Flex key={comment.id} direction='row' pt={1} pb={1}>
      <Flex pr={2}>
        <Image boxSize='2rem' borderRadius={999} src={user?.photoURL} alt='avatar' />
      </Flex>
      <Flex direction='column'>
        <Flex>
          <Flex color='gray.700' fontSize='9pt' fontWeight='700' flexGrow={1}>
            {comment.creatorDisplayText}
          </Flex>
          <Flex color='gray.500' fontSize='9pt' fontWeight='500' ml={1}>
            {convertTimestampToFromNowText(comment.createdAt)}
          </Flex>
        </Flex>
        <Flex color='gray.500' fontSize='9pt' flexGrow={1}>
          {comment.text}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Comment;
