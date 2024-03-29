import {
  OrderByDirection,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
  updateDoc,
} from 'firebase/firestore';
import { firestore, storage } from '../clientApp';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { CommunityData, Post, UserVotedPost } from '@/redux/appSlice';
import { CommentData } from '@/components/Community/Comment';

export const getUserCommunitySnippetDocRef = (userId: string, communityId: string) =>
  doc(firestore, 'users', userId, 'communitySnippets', communityId);

export const getUserVotedPostDocRef = (userId: string, postId: string) =>
  doc(firestore, 'users', userId, 'userVotedPosts', postId);

export const getCommunityDocRef = (communityId: string) =>
  doc(firestore, 'communities', communityId);

export const getPostDocRef = (postId: string) => doc(firestore, 'posts', postId);

export const fetchCommunityByIdAsync = async (communityId: string) => {
  const communityDoc = await getDoc(doc(firestore, 'communities', communityId));
  return communityDoc.data();
};

export const fetchUserByIdAsync = async (uid: string) => {
  const communityDoc = await getDoc(doc(firestore, 'users', uid));
  return communityDoc.data();
};

export const updateCommunityImageAsync = async (communityId: string, fileData: string) => {
  const imageRef = ref(storage, `communities/${communityId}/image`);
  await uploadString(imageRef, fileData, 'data_url');

  const imageURL = await getDownloadURL(imageRef);

  await updateDoc(getCommunityDocRef(communityId), {
    imageURL,
  });

  return imageURL;
};

export const fetchJoinedCommunitiesAsync = async (userId: string) => {
  return (await getDocs(collection(firestore, `users/${userId}/communitySnippets`))).docs.map(
    (doc) => ({ ...doc.data() })
  );
};

export const fetchTopResultsAsync = async (
  collectionName: string,
  field: string,
  sortOrder: 'asc' | 'desc',
  topNum: number
) => {
  const collectionData = collection(firestore, collectionName);

  const topResultsQuery = query(collectionData, orderBy(field, sortOrder), limit(topNum));

  const querySnapshot = await getDocs(topResultsQuery);

  const topResults = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  console.log(topResults);

  return topResults;
};

export const fetchTopCommunitiesAsync = async (topNum: number = 1) => {
  return (await fetchTopResultsAsync(
    'communities',
    'numberOfMembers',
    'desc',
    5
  )) as CommunityData[];
};

export const fetchTopPostsAsync = async (topNum: number = 1) => {
  return (await fetchTopResultsAsync('posts', 'voteStatus', 'desc', 5)) as Post[];
};

export const fetchVotedPostsAsync: (userId: string) => Promise<UserVotedPost[]> = async (
  userId: string
) => {
  return (await getDocs(collection(firestore, `users/${userId}/userVotedPosts`))).docs.map(
    (doc) =>
      ({
        postId: doc.id,
        ...doc.data(),
      } as UserVotedPost)
  );
};

export const joinCommunityAsync = async (userId: string, communityId: string) => {
  await runTransaction(firestore, async (transaction) => {
    transaction.set(getUserCommunitySnippetDocRef(userId, communityId), {
      communityId,
      isModerator: false,
    });

    transaction.update(getCommunityDocRef(communityId), {
      numberOfMembers: increment(1),
    });
  });
};

export const addComment = async (commentData: CommentData) => {
  const commentDocRef = doc(collection(firestore, 'comments'));

  await runTransaction(firestore, async (transaction) => {
    transaction.set(commentDocRef, { ...commentData, id: commentDocRef.id });

    transaction.update(doc(firestore, 'posts', commentData.postId), {
      numberOfComments: increment(1),
    });
  });
  return commentDocRef.id;
};

export const updateUserVotedPostAsync = async (
  userId: string,
  postId: string,
  valueDelta: number
) => {
  await runTransaction(firestore, async (transaction) => {
    const votedPostDoc = await transaction.get(getUserVotedPostDocRef(userId, postId));

    if (votedPostDoc.exists()) {
      transaction.update(getUserVotedPostDocRef(userId, postId), {
        postId,
        value: increment(valueDelta),
      });
    } else {
      transaction.set(getUserVotedPostDocRef(userId, postId), {
        postId,
        value: valueDelta,
      });
    }

    transaction.update(getPostDocRef(postId), {
      voteStatus: increment(valueDelta),
    });
  });
};

export const leaveCommunityAsync = async (userId: string, communityId: string) => {
  await runTransaction(firestore, async (transaction) => {
    transaction.delete(getUserCommunitySnippetDocRef(userId, communityId));
    transaction.update(getCommunityDocRef(communityId), {
      numberOfMembers: increment(-1),
    });
  });
};

export const fetchIsCommunityMemberAsync = async (userId: string, communityId: string) => {
  const docSnapshot = await getDoc(getUserCommunitySnippetDocRef(userId, communityId));

  if (docSnapshot.exists()) {
    const documentData = docSnapshot.data();
    return !!documentData;
  }

  return false;
};
