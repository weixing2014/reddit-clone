import { Flex, Icon } from '@chakra-ui/react';
import { BsArrowUpRightCircle } from 'react-icons/bs';
import { IoVideocamOutline } from 'react-icons/io5';
import { GrAdd } from 'react-icons/gr';
import React from 'react';

function UserIcons({ user }: { user: any }) {
  return (
    <Flex justify='center' borderRight='1px solid' borderColor='gray.200'>
      <IconFlex _hover={{ bgColor: 'gray.200' }}>
        <Icon as={BsArrowUpRightCircle} />
      </IconFlex>
      <IconFlex _hover={{ bgColor: 'gray.200' }}>
        <Icon as={GrAdd} />
      </IconFlex>
    </Flex>
  );
}

export const IconFlex = ({
  children,
  ...otherProps
}: {
  children: React.JSX.Element;
  _hover?: any;
}) => (
  <Flex padding={2} cursor='pointer' fontSize='12pt' borderRadius={4} {...otherProps}>
    {children}
  </Flex>
);

export default UserIcons;
