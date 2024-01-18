import { ReactNode, memo, useMemo } from "react";
import JotaiProvider from '@/app/dashboard/game/context/jotai';

interface LayoutProps {
    children: ReactNode;
}

const MemoizedLayout = memo(Layout);

function Layout({ children }: LayoutProps) {
  const mimoizedChildren = useMemo(() => children, [children]);

  return (
      <JotaiProvider>
          {mimoizedChildren}
      </JotaiProvider>
  );
}

export default MemoizedLayout;