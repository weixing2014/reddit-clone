import { Flex } from '@chakra-ui/react';
import React from 'react';

function PageContent({ children }: { children: any }) {
  return (
    <Flex justify='center' p='16px 0'>
      <Flex width='95%' maxWidth='1180px'>
        <Flex
          direction='column'
          mr={{ base: '0', md: '6px' }}
          width={{ base: '100%', md: '65%' }}
          flexShrink={0}
        >
          {children[0]}
        </Flex>
        <Flex flexGrow={1} direction='column' display={{ base: 'none', md: 'flex' }}>
          {children[1]}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default PageContent;
