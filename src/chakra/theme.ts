import { extendTheme } from '@chakra-ui/react';
import { Button } from './button';
import { Input } from './input';

const theme = extendTheme({
  colors: {
    brand: {
      100: '#FF3c00',
    },
  },
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Raleway', sans-serif`,
  },
  styles: {
    global: () => ({
      body: {
        bg: 'gray.200',
      },
    }),
  },
  components: {
    Button,
    Input,
  },
});

export default theme;
