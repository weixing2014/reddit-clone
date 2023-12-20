import { addComment } from '@/firebase/api';
import { firestore } from '@/firebase/clientApp';
import { Post, increaseNumberOfComments } from '@/redux/appSlice';
import { Button, Flex, Input } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { collection, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Comment, { CommentData } from './Comment';
import { useDispatch } from 'react-redux';

function Comments({ user, post }: { user?: User | null; post: Post }) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentData[]>([]);
  const dispatch = useDispatch();

  const fetchComments = async () => {
    const commentsQuery = query(
      collection(firestore, 'comments'),
      where('postId', '==', post.id),
      orderBy('createdAt', 'desc')
    );

    const commentDocs = await getDocs(commentsQuery);
    const comments = commentDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CommentData[];
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

            const newComment: CommentData = {
              creatorId: user.uid,
              creatorDisplayText: user.displayName,
              postId: post.id!,
              text: commentText,
              createdAt: serverTimestamp(),
            };

            try {
              const postDocRef = await addComment(newComment);
              setCommentText('');
              fetchComments();
              dispatch(increaseNumberOfComments({ postId: post.id!, delta: 1 }));
            } catch (e) {
              console.log('Create new comment error :>> ', e);
            }
          }}
        >
          Send
        </Button>
      </Flex>
      <Flex direction='column' mt={2}>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </Flex>
    </Flex>
  );
}

export default Comments;
