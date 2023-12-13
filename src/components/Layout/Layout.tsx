import React from 'react';

import Navbar from '../Navbar/Navbar';

type props = { children: React.JSX.Element };

function Layout({ children }: props) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export default Layout;
