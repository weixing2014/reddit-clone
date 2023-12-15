import { firestore, storage } from '@/firebase/clientApp';
import { Post } from '@/redux/appSlice';
import { Flex, Input, Image, Button } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import router from 'next/router';
import React, { useEffect, useState } from 'react';

export type Comment = {
  id?: string;
  creatorId: string;
  creatorDisplayText: string;
  postId: string;
  text: string;
  createdAt: Timestamp;
};

function Comments({ user, post }: { user?: User | null; post: Post }) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    const commentsQuery = query(
      collection(firestore, 'comments'),
      where('postId', '==', post.id),
      orderBy('createdAt', 'desc')
    );

    const commentDocs = await getDocs(commentsQuery);
    const comments = commentDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Comment[];
    setComments(comments);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <Flex direction='column' width='100%'>
      <Flex bgColor='white' pt={2} justify='center' borderColor='gray.300'>
        <Input
          placeholder='Add your comment'
          flexGrow={1}
          value={commentText}
          onChange={(e) => {
            setCommentText(e.target.value);
          }}
        />
        <Button
          onClick={async () => {
            if (!user) return;

            const newComment = {
              creatorId: user.uid,
              creatorDisplayText: user.displayName,
              postId: post.id,
              text: commentText,
              createdAt: serverTimestamp(),
            };

            try {
              const postDocRef = await addDoc(collection(firestore, 'comments'), newComment);
              setCommentText('');
              fetchComments();
            } catch (e) {
              console.log('Create new comment error :>> ', e);
            }
          }}
        >
          Send
        </Button>
      </Flex>
      {comments.map((comment) => (
        <Flex key={comment.id} direction='row' pt={1} pb={1}>
          <Flex pr={2}>
            <Image boxSize='1.5rem' borderRadius='2px' src={''} alt='avatar' />
          </Flex>
          <Flex color='gray.500' fontSize='10pt' flexGrow={1}>
            {comment.text}
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
}

export default Comments;
