import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import SearchInput from './SearchInput';
import RightContent from './RightContent';
import CommunitySelect from './CommunitySelect';

function Navbar() {
  return (
    <Flex bg='white' height='44px' padding='6px 12px' align='center'>
      <Image src='/images/Reddit-logo-768x492.png' alt='reddit logo' height='50px' />
      <CommunitySelect />
      <SearchInput />
      <RightContent />
    </Flex>
  );
}

export default Navbar;
