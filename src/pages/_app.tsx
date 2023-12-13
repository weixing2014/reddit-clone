import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from '../redux/appSlice';
import theme from '../chakra/theme';
import Layout from '../components/Layout/Layout';
import React from 'react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <React.StrictMode>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </React.StrictMode>
    </ChakraProvider>
  );
}
