import { auth } from '@/firebase/clientApp';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDispatch, useSelector } from 'react-redux';
import * as reduxStore from '@/redux/appSlice';
import {
  fetchJoinedCommunitiesAsync,
  joinCommunityAsync,
  leaveCommunityAsync,
} from '../firebase/api/api';

const useCommunityData = (communityId?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();
  const joinedCommunities = useSelector(reduxStore.selectJoinedCommunities);

  useEffect(() => {
    setJoinedCommunities();
  }, [user]);

  const setJoinedCommunities = async () => {
    if (!user) return;

    let joinedCommunities: any = [];

    try {
      setLoading(true);
      joinedCommunities = await fetchJoinedCommunitiesAsync(user?.uid);
    } catch (e: any) {
      setError(e);
    }

    setLoading(false);
    dispatch(reduxStore.setJoinedCommunities(joinedCommunities));
  };

  const joinCommunity = async (communityId: string) => {
    if (!user) return;

    setLoading(true);

    try {
      await joinCommunityAsync(user?.uid, communityId);
    } catch (e: any) {
      setError(e);
      return;
    }

    setLoading(false);
    dispatch(
      reduxStore.setJoinedCommunities([...joinedCommunities, { communityId, isModerator: false }])
    );
  };

  const leaveCommunity = async (communityId: string) => {
    if (!user) return;

    setLoading(true);

    try {
      await leaveCommunityAsync(user?.uid, communityId);
    } catch (e: any) {
      setError(e);
    }

    setLoading(false);

    dispatch(
      reduxStore.setJoinedCommunities(
        joinedCommunities.filter((community: any) => community.communityId !== communityId)
      )
    );
  };

  return {
    loading,
    error,
    joinCommunity,
    leaveCommunity,
    joinedCommunities,
  };
};

export default useCommunityData;
