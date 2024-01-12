import { Provider } from 'jotai';
import { ReactNode } from 'react';

interface IJotaiProvider {
    children: ReactNode;
}

const JotaiProvider = ({ children }: IJotaiProvider) => {
  return (
    <Provider>
      {children}
    </Provider>
  );
}

export default JotaiProvider;