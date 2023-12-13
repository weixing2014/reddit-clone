import Sidebar from '@/components/Community/Sidebar';
import PageContent from '@/components/Layout/PageContent';
import { auth, firestore, storage } from '@/firebase/clientApp';
import { Post } from '@/redux/appSlice';
import { Button, Flex, Input, Textarea } from '@chakra-ui/react';
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import ImageUploader from '../../../components/Shared/ImageUploader';

function Submit() {
  const router = useRouter();
  const { communityId } = router.query;
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [selectedFile, setSelectedFile] = useState<string | undefined>(undefined);
  const [content, setContent] = useState<{ title: string; body: string; selectedFile?: string }>({
    title: '',
    body: '',
  });

  const onInputChange = (e: any) => {
    const {
      target: { name, value },
    } = e;

    setContent({
      ...content,
      [name]: value,
    });
  };

  return (
    <PageContent>
      <Flex backgroundColor='white' flexDirection='column' padding={4}>
        <Input
          name='title'
          placeholder='Title'
          mb={3}
          fontSize='10pt'
          value={content.title}
          onChange={onInputChange}
        />
        <Textarea
          name='body'
          placeholder='Text (optional)'
          fontSize='9pt'
          mb={3}
          h={40}
          value={content.body}
          onChange={onInputChange}
        />
        <ImageUploader selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
        <Flex justifyContent='flex-end'>
          <Button
            isDisabled={!content.title || !content.body || loading}
            isLoading={loading}
            h={8}
            onClick={async () => {
              if (!user || !communityId) return;

              const newPost: Post = {
                communityId: communityId as string,
                creatorId: user?.uid,
                creatorDisplayName: user?.email?.split('@')?.[0],
                title: content.title,
                body: content.body,
                numberOfComments: 0,
                voteStatus: 0,
                createdAt: serverTimestamp(),
              };

              setLoading(true);

              try {
                const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);

                if (selectedFile) {
                  const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
                  await uploadString(imageRef, selectedFile, 'data_url');

                  const downloadURL = await getDownloadURL(imageRef);

                  await updateDoc(postDocRef, {
                    imageURL: downloadURL,
                  });
                }

                router.push(`/r/${communityId}`);
              } catch (e) {
                console.log('Create new post error :>> ', e);
              }

              setLoading(false);
            }}
          >
            Post
          </Button>
        </Flex>
      </Flex>
      <>
        <Sidebar />
      </>
    </PageContent>
  );
}

export default Submit;
