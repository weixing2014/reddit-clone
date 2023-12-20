import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  runTransaction,
  updateDoc,
} from 'firebase/firestore';
import { firestore, storage } from './clientApp';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { UserVotedPost } from '@/redux/appSlice';
import { CommentData } from '@/components/Community/Comment';

export const getUserCommunitySnippetDocRef = (userId: string, communityId: string) =>
  doc(firestore, 'users', userId, 'communitySnippets', communityId);

export const getUserVotedPostsDocRef = (userId: string, postId: string) =>
  doc(firestore, 'users', userId, 'userVotedPosts', postId);

export const getCommunityDocRef = (communityId: string) =>
  doc(firestore, 'communities', communityId);

export const getPostDocRef = (postId: string) => doc(firestore, 'posts', postId);

export const fetchCommunityById = async (communityId: string) => {
  try {
    const communityDoc = await getDoc(doc(firestore, 'communities', communityId));
    return communityDoc.data();
  } catch (e: any) {
    throw e;
  }
};

export const getUserById = async (uid: string) => {
  try {
    const communityDoc = await getDoc(doc(firestore, 'users', uid));
    return communityDoc.data();
  } catch (e: any) {
    throw e;
  }
};

export const updateCommunityImage = async (communityId: string, fileData: string) => {
  try {
    const imageRef = ref(storage, `communities/${communityId}/image`);
    await uploadString(imageRef, fileData, 'data_url');

    const imageURL = await getDownloadURL(imageRef);

    await updateDoc(getCommunityDocRef(communityId), {
      imageURL,
    });

    return imageURL;
  } catch (e) {
    console.log('Update community image error :>> ', e);
  }
};

export const getJoinedCommunities = async (userId: string) => {
  try {
    return (await getDocs(collection(firestore, `users/${userId}/communitySnippets`))).docs.map(
      (doc) => ({ ...doc.data() })
    );
  } catch (e: any) {
    throw e;
  }
};

export const getVotedPosts: (userId: string) => Promise<UserVotedPost[]> = async (
  userId: string
) => {
  try {
    return (await getDocs(collection(firestore, `users/${userId}/userVotedPosts`))).docs.map(
      (doc) =>
        ({
          postId: doc.id,
          ...doc.data(),
        } as UserVotedPost)
    );
  } catch (e: any) {
    throw e;
  }
};

export const joinCommunity = async (userId: string, communityId: string) => {
  try {
    await runTransaction(firestore, async (transaction) => {
      transaction.set(getUserCommunitySnippetDocRef(userId, communityId), {
        communityId,
        isModerator: false,
      });

      transaction.update(getCommunityDocRef(communityId), {
        numberOfMembers: increment(1),
      });
    });
  } catch (e: any) {
    throw e;
  }
};

export const addComment = async (commentData: CommentData) => {
  try {
    await runTransaction(firestore, async (transaction) => {
      transaction.set(doc(collection(firestore, 'comments')), commentData);

      transaction.update(doc(firestore, 'posts', commentData.postId), {
        numberOfComments: increment(1),
      });
    });
  } catch (e: any) {
    throw e;
  }
};

export const updateUserPostVotes = async (userId: string, postId: string, valueDelta: number) => {
  console.log('valueDelta :>> ', valueDelta);
  try {
    await runTransaction(firestore, async (transaction) => {
      const votedPostDoc = await transaction.get(getUserVotedPostsDocRef(userId, postId));

      if (votedPostDoc.exists()) {
        transaction.update(getUserVotedPostsDocRef(userId, postId), {
          postId,
          value: increment(valueDelta),
        });
      } else {
        transaction.set(getUserVotedPostsDocRef(userId, postId), {
          postId,
          value: valueDelta,
        });
      }

      transaction.update(getPostDocRef(postId), {
        voteStatus: increment(valueDelta),
      });
    });
  } catch (e: any) {
    throw e;
  }
};

export const leaveCommunity = async (userId: string, communityId: string) => {
  try {
    await runTransaction(firestore, async (transaction) => {
      transaction.delete(getUserCommunitySnippetDocRef(userId, communityId));
      transaction.update(getCommunityDocRef(communityId), {
        numberOfMembers: increment(-1),
      });
    });
  } catch (e: any) {
    throw e;
  }
};

export const isCommunityMember = async (userId: string, communityId: string) => {
  const docSnapshot = await getDoc(getUserCommunitySnippetDocRef(userId, communityId));

  if (docSnapshot.exists()) {
    const documentData = docSnapshot.data();
    return !!documentData;
  }

  return false;
};
