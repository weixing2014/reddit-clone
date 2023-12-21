import { fetchVotedPostsAsync } from '@/firebase/api/api';
import { firestore, storage } from '@/firebase/clientApp';
import * as reduxStore from '@/redux/appSlice';
import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const usePosts = (communityId: string, userId?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const currentPosts = useSelector(reduxStore.selectCurrentPosts);

  useEffect(() => {
    fetchCurrentPosts(communityId);
  }, [communityId]);

  useEffect(() => {
    userId && fetchUserVotedPosts(userId);
  }, [userId]);

  const fetchUserVotedPosts = async (userId: string) => {
    setLoading(true);

    try {
      const userVotedPosts = await fetchVotedPostsAsync(userId);

      dispatch(reduxStore.setUserVotedPosts(userVotedPosts));
    } catch (e: any) {
      console.log('fetchPosts error :>> ', e.message);
    }

    setLoading(false);
  };

  const fetchCurrentPosts = async (communityId: string) => {
    setLoading(true);

    try {
      const postsQuery = query(
        collection(firestore, 'posts'),
        where('communityId', '==', communityId),
        orderBy('createdAt', 'desc')
      );

      const postDocs = await getDocs(postsQuery);

      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() } as reduxStore.Post));

      dispatch(reduxStore.setCurrentPosts(posts));
    } catch (e: any) {
      console.log('fetchPosts error :>> ', e.message);
    }

    setLoading(false);
  };

  const deletePost = async (post: reduxStore.Post) => {
    try {
      if (post.imageURL) {
        await deleteObject(ref(storage, `posts/${post.id}/image`));
      }

      await deleteDoc(doc(firestore, 'posts', post.id!));

      dispatch(reduxStore.setCurrentPosts(currentPosts.filter((p) => post.id !== p.id)));
    } catch (e: any) {
      console.log('Delete post error :>> ', e.message);
    }
  };

  return { loading, error, currentPosts, deletePost };
};

export default usePosts;
