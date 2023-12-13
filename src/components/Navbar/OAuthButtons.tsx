import React from 'react';
import { Text, Button, Flex, Image } from '@chakra-ui/react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase/clientApp';

const googleProvider = new GoogleAuthProvider();

function OAuthButtons() {
  return (
    <Flex width='100%' flexDirection='column' align='center' justify='center'>
      <Button
        width='100%'
        variant='outline'
        onClick={() => {
          signInWithPopup(auth, googleProvider).catch((e) => alert(e.Message));
        }}
      >
        Continue with Google
      </Button>
    </Flex>
  );
}

export default OAuthButtons;
