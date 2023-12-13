import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Text,
  Image,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Icon,
  Flex,
} from '@chakra-ui/react';
import React from 'react';
import { IconFlex } from './UserIcons';
import { MdOutlineLogin } from 'react-icons/md';
import { auth } from '@/firebase/clientApp';
import { signOut } from 'firebase/auth';

function UserMenu({ user }: { user: any }) {
  return (
    <Menu>
      <MenuButton bgColor='none'>
        <Flex align='center' ml={2}>
          <Image boxSize='1.5rem' borderRadius='2px' src={user.photoURL} alt={user.email} />
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList fontSize='9pt' fontWeight={700}>
        <MenuItem
          padding={0}
          _hover={{ bgColor: 'blue.500', color: 'white' }}
          onClick={() => signOut(auth)}
        >
          <IconFlex>
            <Icon as={MdOutlineLogin} />
          </IconFlex>
          <span>Log Out</span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default UserMenu;
