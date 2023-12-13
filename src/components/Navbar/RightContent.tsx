import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import React from 'react';
import AuthButtons from './AuthButtons';
import AuthModal from '../Modal/Auth/AuthModal';
import { auth } from '@/firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ChevronDownIcon } from '@chakra-ui/icons';
import UserIcons from './UserIcons';
import UserMenu from './UserMenu';

function RightContent() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      <Flex align='center' justify='center'>
        {user ? (
          <>
            <UserIcons user={user} />
            <UserMenu user={user} />
          </>
        ) : (
          <AuthButtons />
        )}
        <AuthModal />
      </Flex>
    </>
  );
}

export default RightContent;
