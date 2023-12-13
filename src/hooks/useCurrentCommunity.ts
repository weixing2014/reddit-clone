import * as reduxStore from '@/redux/appSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as firebaseAPI from '../firebase/api';

const useCurrentCommunity = (communityId?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const joinedCommunities = useSelector(reduxStore.selectJoinedCommunities);
  const currentCommunity = useSelector(reduxStore.selectCurrentCommunity);

  useEffect(() => {
    communityId && fetchCurrentCommunity(communityId);
  }, [communityId]);

  const fetchCurrentCommunity = async (communityId: string) => {
    try {
      setLoading(true);
      const community = await firebaseAPI.fetchCommunityById(communityId);
      setCurrentCommunity(community as reduxStore.CommunityData);
      setLoading(false);
    } catch (e: any) {
      setError(e);
    }
  };

  const setCurrentCommunity = (community: reduxStore.CommunityData) => {
    dispatch(reduxStore.setCurrentCommunity(community));
  };

  const updateCommunityImage = async (communityId: string, fileData: string) => {
    setLoading(true);

    try {
      const imageURL = await firebaseAPI.updateCommunityImage(communityId, fileData);

      setCurrentCommunity({
        ...currentCommunity,
        imageURL,
      } as reduxStore.CommunityData);
    } catch (e: any) {
      setError(e);
    }

    setLoading(false);
  };

  return {
    loading,
    error,
    joinedCommunities,
    currentCommunity,
    setCurrentCommunity,
    updateCommunityImage,
  };
};

export default useCurrentCommunity;
