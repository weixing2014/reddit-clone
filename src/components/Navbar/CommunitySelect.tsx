import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  Image,
} from '@chakra-ui/react';
import { GrAdd } from 'react-icons/gr';
import { TiHome } from 'react-icons/ti';
import CreateCommunityModal from './CreateCommunityModal';
import { IconFlex } from './UserIcons';
import useCommunityData from '@/hooks/useCommunityData';
import { useRouter } from 'next/router';
import { AiOutlineReddit } from 'react-icons/ai';

function CommunitySelect() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loading, joinedCommunities } = useCommunityData();
  const router = useRouter();

  return (
    <>
      <Menu>
        <MenuButton
          width={240}
          as={Button}
          variant='dropdown'
          ml='2px'
          rightIcon={<ChevronDownIcon />}
        >
          <Flex align='center'>
            <Icon fontSize='24px' as={TiHome} mr={1} />
            <Text fontSize='10pt' fontWeight={700}>
              Home
            </Text>
          </Flex>
        </MenuButton>
        <MenuList fontSize='9pt' fontWeight={700}>
          <MenuItem padding={0} _hover={{ bgColor: 'blue.500', color: 'white' }} onClick={onOpen}>
            <IconFlex>
              <Icon as={GrAdd} />
            </IconFlex>
            <span>Create Communities</span>
          </MenuItem>
          {joinedCommunities.map((c) => (
            <MenuItem
              key={c.communityId}
              padding={0}
              _hover={{ bgColor: 'blue.500', color: 'white' }}
              onClick={() => {
                router.push(`/r/${c.communityId}`);
              }}
            >
              <IconFlex>
                <Icon as={AiOutlineReddit} />
              </IconFlex>
              <span>{c.communityId}</span>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <CreateCommunityModal onClose={onClose} isOpen={isOpen} />
    </>
  );
}

export default CommunitySelect;
