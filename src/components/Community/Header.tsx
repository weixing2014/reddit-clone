import { auth } from '@/firebase/clientApp';
import { isCommunityMember, joinCommunity, leaveCommunity } from '@/firebase/api';
import { Box, Button, ButtonProps, Flex, Image, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import useCommunityData from '@/hooks/useCommunityData';
import { CommunityData } from '@/redux/appSlice';

const CommunityButton = ({ children, ...props }: ButtonProps) => (
  <Button width='80%' height='50%' {...props}>
    {children}
  </Button>
);

function Header({ communityData }: { communityData: CommunityData }) {
  const [user] = useAuthState(auth);

  const { loading, joinCommunity, leaveCommunity, error, joinedCommunities } = useCommunityData();

  return (
    <Flex direction='column' width='100%'>
      <Box height='70px' bg='blue.400' />
      <Flex bgColor='white' width='100%' justify='center'>
        <Flex width={{ base: '100%', md: '85%' }} maxWidth='1180px' pb='15px'>
          <Flex>
            <Image
              src={
                communityData?.imageURL ||
                'https://cdn.pixabay.com/photo/2017/09/25/13/12/puppy-2785074_1280.jpg'
              }
              boxSize='5em'
              borderRadius='999px'
              border='5px solid white'
              alt='Community picture'
              mt='-8px'
              mr='10px'
            />
            <Flex flexDirection='column' mt='5px'>
              <Text
                color='gray.500'
                fontSize='10pt'
                fontWeight='700'
                mb='5px'
              >{`r/${communityData?.id}`}</Text>
              {user?.uid &&
                (joinedCommunities.map((c) => c.communityId).includes(communityData.id) ? (
                  <CommunityButton
                    isLoading={loading}
                    onClick={async () => {
                      await leaveCommunity(communityData.id);
                    }}
                    variant='outline'
                  >
                    Joined
                  </CommunityButton>
                ) : (
                  <CommunityButton
                    isLoading={loading}
                    onClick={async () => {
                      await joinCommunity(communityData.id);
                    }}
                  >
                    Join
                  </CommunityButton>
                ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Header;
