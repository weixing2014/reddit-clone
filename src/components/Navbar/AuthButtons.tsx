import { setAuthModalState } from '@/redux/appSlice';
import { Button } from '@chakra-ui/react';
import React from 'react';
import { useDispatch } from 'react-redux';

const buttonProps = {
  height: '28px',
  display: { base: 'none', sm: 'flex' },
  width: { base: '70px', md: '110px' },
  mr: 2,
};

function AuthButtons() {
  const dispatch = useDispatch();

  return (
    <>
      <Button
        variant='outline'
        {...buttonProps}
        onClick={() => {
          dispatch(setAuthModalState({ open: true, view: 'login' }));
        }}
      >
        Log In
      </Button>
      <Button
        {...buttonProps}
        onClick={() => {
          dispatch(setAuthModalState({ open: true, view: 'signup' }));
        }}
      >
        Sign Up
      </Button>
    </>
  );
}

export default AuthButtons;
