import { auth, firestore } from '@/firebase/clientApp';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  maxLength?: number;
};

function CreateCommunityModal({ isOpen, onClose, maxLength = 21 }: Props) {
  const [communityName, setCommunityName] = useState('');
  const [error, setError] = useState('');
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: { target: { value: string } }) => {
    const specialCharacterFormat = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    setError(
      specialCharacterFormat.test(e.target.value) ? 'No special characters in the name!' : ''
    );

    if (e.target.value.length <= maxLength) {
      setCommunityName(e.target.value);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a community</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired isInvalid={!communityName}>
            <FormLabel>Name</FormLabel>
            <Input isRequired type='text' value={communityName} onChange={handleInputChange} />
            <FormHelperText fontSize='9pt' color={maxLength - communityName.length ? 'gray.500' : 'red'}>
              {maxLength - communityName.length} Characters remaining
            </FormHelperText>
            <FormHelperText fontSize='9pt' color='red'>
              {error}
            </FormHelperText>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant='outline' mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='solid'
            isDisabled={!!error}
            isLoading={loading}
            _hover={{}}
            onClick={async () => {
              try {
                setLoading(true);

                const communityDocRef = doc(firestore, 'communities', communityName);

                await runTransaction(firestore, async (transaction) => {
                  const communityDoc = await transaction.get(communityDocRef);

                  if (communityDoc.exists()) {
                    throw new Error(`Sorry, ${communityName} has been taken. Try another.`);
                  }

                  transaction.set(communityDocRef, {
                    creatorId: user?.uid,
                    createdAt: serverTimestamp(),
                    numberOfMembers: 1,
                    privacyType: 'PUBLIC',
                  });

                  transaction.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityName), {
                    communityId: communityName,
                    isModerator: true,
                  });
                });

                setLoading(false);
                onClose();
              } catch (e: any) {
                setLoading(false);
                setError(e?.message);
              }
            }}
          >
            Create Community
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CreateCommunityModal;
