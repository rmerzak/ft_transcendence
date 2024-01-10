import { Provider } from 'jotai';
import React from 'react';

const JotaiProvider = ({ children } : any) => {
  return (
    <Provider>
      {children}
    </Provider>
  );
}

export default JotaiProvider;