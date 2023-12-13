import { Button, Image, Flex, Stack } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import FileUploadWrapper from './FileUploadWrapper';

type Props = {
  setSelectedFile: (fileData?: string) => void;
  selectedFile?: string;
};

function ImageUploader({ selectedFile, setSelectedFile }: Props) {
  return (
    <Flex justify='center' align='center' width='100%' mb={2}>
      <Flex
        justify='center'
        align='center'
        p={10}
        border='1px dashed'
        borderColor='gray.200'
        width='100%'
        borderRadius={4}
      >
        {selectedFile ? (
          <Flex direction='column' align='center' justify='center' width='100%'>
            <Image src={selectedFile} maxWidth='400px' maxHeight='400' alt='Uploaded image' />

            <Button
              mt={4}
              height='28px'
              variant='outline'
              onClick={() => {
                setSelectedFile(undefined);
              }}
            >
              Remove
            </Button>
          </Flex>
        ) : (
          <FileUploadWrapper onFileSelected={setSelectedFile}>
            {({ openFileSelector }) => (
              <Button variant='outline' height='28px' onClick={openFileSelector}>
                Upload
              </Button>
            )}
          </FileUploadWrapper>
        )}
      </Flex>
    </Flex>
  );
}

export default ImageUploader;
