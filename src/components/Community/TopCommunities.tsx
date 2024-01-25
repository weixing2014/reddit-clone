import { Button, Flex, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchTopCommunitiesAsync } from '@/firebase/api/api';
import { CommunityData } from '@/redux/appSlice';
import { Image, Text } from '@chakra-ui/react';
import useCommunityData from '@/hooks/useCommunityData';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';

function TopCommunities() {
  const router = useRouter();
  const { communityId } = router.query;
  const [user] = useAuthState(auth);
  const [topCommunities, setTopCommunities] = useState<CommunityData[]>([]);

  const initTopCommunities = async () => {
    const topCommunities = await fetchTopCommunitiesAsync(10);
    setTopCommunities(topCommunities);
  };

  const { loading, joinCommunity, leaveCommunity, error, joinedCommunities } = useCommunityData();

  useEffect(() => {
    initTopCommunities();
  }, []);

  return (
    <>
      <Flex direction='column' bgColor='white' borderRadius={4} mt={4}>
        <Flex
          borderTopLeftRadius={4}
          borderTopRightRadius={4}
          h='50px'
          bgColor='gray.700'
          width='100%'
          color='white'
          align='center'
          fontSize='12pt'
          fontWeight='700'
          pl={4}
        >
          Top Communities
        </Flex>
        <Flex direction='column' pl={2} mt={2}>
          {topCommunities.map((communityData) => (
            <Flex key={communityData.id} justifyContent='space-between' alignItems='center'>
              <Flex alignItems='center'>
                <Image
                  src={
                    communityData?.imageURL ||
                    'https://cdn.pixabay.com/photo/2017/09/25/13/12/puppy-2785074_1280.jpg'
                  }
                  boxSize='3em'
                  borderRadius='999px'
                  border='5px solid white'
                  alt='Community picture'
                  mr='10px'
                />
                <Link
                  color='gray.500'
                  fontSize='10pt'
                  fontWeight='700'
                  href={`/r/${communityData?.id}`}
                >{`r/${communityData?.id}`}</Link>
              </Flex>
              <Flex mr={2}>
                {user?.uid &&
                  (joinedCommunities.map((c) => c.communityId).includes(communityData.id) ? (
                    <Button
                      isLoading={loading}
                      onClick={async () => {
                        await leaveCommunity(communityData.id);
                      }}
                      variant='outline'
                      h={8}
                      w={20}
                    >
                      Joined
                    </Button>
                  ) : (
                    <Button
                      h={8}
                      w={20}
                      isLoading={loading}
                      onClick={async () => {
                        await joinCommunity(communityData.id);
                      }}
                    >
                      Join
                    </Button>
                  ))}
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </>
  );
}

export default TopCommunities;
