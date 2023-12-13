import { selectAuthModalState, setAuthModalState } from '@/redux/appSlice';
import { Button } from '@chakra-ui/button';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  InputGroup,
  Input,
  Text,
  Link,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import OAuthButtons from '../../Navbar/OAuthButtons';
import SignUp from './SignUp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import LogIn from './LogIn';

function AuthModal() {
  const authModalState = useSelector(selectAuthModalState);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(setAuthModalState({ open: false }));
  };
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  // TODO: Reset password
  return (
    <>
      <Modal isOpen={authModalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign='center'>
            {authModalState.view === 'login' && 'Login'}
            {authModalState.view === 'signup' && 'Sign Up'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex display='flex' flexDirection='column' justify='center' align='center'>
              <Flex flexDirection='column' justify='center' align='center' width='70%'>
                <OAuthButtons />
                <Text margin='10px 0' color='gray.500' fontWeight={700}>
                  OR
                </Text>
                {authModalState.view === 'login' && <LogIn />}
                {authModalState.view === 'signup' && <SignUp />}
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AuthModal;
