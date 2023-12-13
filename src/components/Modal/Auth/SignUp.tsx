import { setAuthModalState } from '@/redux/appSlice';
import { Input, Button, Text, Flex } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import React, { useRef, useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';

function SignUp() {
  const [createUserWithEmailAndPassword, user, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const dispatch = useDispatch();
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const confirmPasswordRef = useRef<any>(null);
  const [clientErrorMessage, setClientErrorMessage] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (clientErrorMessage) setClientErrorMessage('');

        if (passwordRef.current?.value !== confirmPasswordRef.current?.value) {
          setClientErrorMessage('Passwords do not match!');
        }

        createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value);
      }}
    >
      <Input
        ref={emailRef}
        required
        mb={2}
        name='email'
        type='email'
        placeholder='Email'
      />
      <Input
        ref={passwordRef}
        required
        mb={2}
        name='password'
        type='password'
        placeholder='Password'
      />
      <Input
        ref={confirmPasswordRef}
        required
        mb={2}
        name='confirmPassword'
        type='password'
        placeholder='Confirm password'
      />
      <Text textAlign='center' color='red' fontSize='9pt'>
        {clientErrorMessage || userError?.message}
      </Text>
      <Button type='submit' width='100%' margin='10px 0' isLoading={loading}>
        Sign Up
      </Button>
      <Flex justify='center' fontSize='9pt'>
        <Text>Already registered?</Text>
        <Text
          ml='2px'
          display='inline'
          color='blue.500'
          fontWeight={700}
          cursor='pointer'
          onClick={() => {
            dispatch(setAuthModalState({ open: true, view: 'login' }));
          }}
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
}

export default SignUp;
