import { auth, firestore, storage } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import { CommunityData } from '@/redux/appSlice';
import { Button, Flex, Image, Stack, Text } from '@chakra-ui/react';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import FileUploadWrapper from '../Shared/FileUploadWrapper';
import useCurrentCommunity from '@/hooks/useCurrentCommunity';
import { updateCommunityImageAsync } from '@/firebase/api/api';
import { useState } from 'react';
import TopCommunities from './TopCommunities';

function Sidebar() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { communityId } = router.query;
  const { currentCommunity, updateCommunityImageAsync, loading } = useCurrentCommunity(
    communityId as string
  );


  return (
    <>
      <Flex direction='column' bgColor='white' borderRadius={4}>
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
          About Community
        </Flex>
        <Flex p={4} color='gray.500'>
          Created {currentCommunity?.createdAt.toDate().toLocaleDateString()}
        </Flex>
        <Flex
          ml={2}
          mr={2}
          p={2}
          borderTop='1px solid'
          borderBottom='1px solid'
          borderColor='gray.300'
        >
          <Flex width='50%' direction='column'>
            <Text fontWeight='700'>{currentCommunity?.numberOfMembers}</Text>
            <Text color='gray.500'>Members</Text>
          </Flex>
          <Flex width='50%' direction='column'>
            <Text fontWeight='700'>{currentCommunity?.numberOfMembers}</Text>
            <Text color='gray.500'>Online</Text>
          </Flex>
        </Flex>
        <Flex p={2} pt={4} pb={4} w='100%'>
          <Button
            w='100%'
            fontWeight='700'
            fontSize='10pt'
            onClick={() => {
              router.push(`/r/${communityId}/submit`);
            }}
          >
            Create Post
          </Button>
        </Flex>
        {user?.uid === currentCommunity?.creatorId && (
          <Flex align='center' justify='space-between' p={4}>
            <Stack gap={0}>
              <Flex fontSize='12pt' fontWeight='700'>
                Admin
              </Flex>
              <Flex color='blue.500' _hover={{ cursor: 'pointer' }}>
                <FileUploadWrapper
                  onFileSelected={async (fileData) => {
                    await updateCommunityImageAsync(communityId as string, fileData as string);
                  }}
                >
                  {({ openFileSelector }) =>
                    loading ? (
                      <Text color='gray.500'>Uploading…</Text>
                    ) : (
                      <Text onClick={openFileSelector}>Change image</Text>
                    )
                  }
                </FileUploadWrapper>
              </Flex>
            </Stack>
            <Image
              src={currentCommunity?.imageURL}
              alt='Community image'
              boxSize={10}
              borderRadius={999}
            />
          </Flex>
        )}
      </Flex>
      <TopCommunities />
    </>
  );
}

export default Sidebar;
