import { setAuthModalState } from '@/redux/appSlice';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';
import { auth } from '../../../firebase/clientApp';

function LogIn() {
  const [createUserWithEmailAndPassword, user, loading, userError] =
    useSignInWithEmailAndPassword(auth);

  const dispatch = useDispatch();
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value);
      }}
    >
      <Input
        required
        ref={emailRef}
        mb={2}
        name='email'
        type='email'
        placeholder='Email'
        bg='white'
      />
      <Input
        required
        ref={passwordRef}
        mb={2}
        name='password'
        type='password'
        placeholder='Password'
      />
      <Text textAlign='center' color='red' fontSize='9pt'>
        {userError?.message}
      </Text>

      <Button type='submit' width='100%' margin='10px 0' isLoading={loading}>
        Log In
      </Button>
      <Flex justify='center' fontSize='9pt'>
        <Text>New here?</Text>
        <Text
          ml='2px'
          display='inline'
          color='blue.500'
          fontWeight={700}
          cursor='pointer'
          onClick={() => {
            dispatch(setAuthModalState({ open: true, view: 'signup' }));
          }}
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  );
}

export default LogIn;
