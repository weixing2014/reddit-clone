import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import { SearchIcon } from '@chakra-ui/icons';

function SearchInput() {
  return (
    <Flex margin='0 5px' flexGrow={1} align='center'>
      <InputGroup>
        <InputLeftElement alignItems='center' pointerEvents='none'>
          <SearchIcon color='gray.300' mb={1} />
        </InputLeftElement>
        <Input
          placeholder='Search Reddit'
          fontSize='10pt'
          _placeholder={{ color: 'gray.500' }}
          _hover={{ border: '1px solid', borderColor: 'blue.500' }}
          _focus={{
            border: '1px solid',
            borderColor: 'blue.500',
          }}
          height='34px'
          bg='gray.50'
        />
      </InputGroup>
    </Flex>
  );
}

export default SearchInput;
