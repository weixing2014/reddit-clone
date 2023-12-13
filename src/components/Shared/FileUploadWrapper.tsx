import React, { useRef, useState } from 'react';

function FileUploadWrapper({
  children,
  onFileSelected,
}: {
  children: ({ openFileSelector }: { openFileSelector: () => void }) => React.JSX.Element;
  onFileSelected: (fileData: string | undefined) => void;
}) {
  const fileSelectorRef = useRef<HTMLInputElement>(null);

  const openFileSelector = () => {
    fileSelectorRef.current?.click();
  };

  return (
    <>
      {children({ openFileSelector })}
      <input
        ref={fileSelectorRef}
        type='file'
        hidden
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const reader = new FileReader();

          if (e.target.files?.[0]) {
            reader.readAsDataURL(e.target.files[0]);

            reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
              if (readerEvent.target?.result) {
                onFileSelected(readerEvent.target.result as string);
              }
            };
          }
        }}
      />
    </>
  );
}

export default FileUploadWrapper;
