import CreatePostLink from '@/components/Community/CreatePostLink';
import Header from '@/components/Community/Header';
import Posts from '@/components/Community/Posts';
import Sidebar from '@/components/Community/Sidebar';
import PageContent from '@/components/Layout/PageContent';
import { auth, firestore } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import useCurrentCommunity from '@/hooks/useCurrentCommunity';
import { CommunityData } from '@/redux/appSlice';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

function CommunityPage() {
  const router = useRouter();
  const { communityId } = router.query;
  const { currentCommunity } = useCurrentCommunity(communityId as string);
  const communityData = {
    id: communityId as string,
    ...currentCommunity,
  };

  return (
    currentCommunity && (
      <>
        <Header communityData={communityData as CommunityData} />
        <PageContent>
          <>
            <CreatePostLink />
            <Posts communityData={communityData as CommunityData} />
          </>
          <>
            <Sidebar />
          </>
        </PageContent>
      </>
    )
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return { props: {} };
}

export default CommunityPage;
