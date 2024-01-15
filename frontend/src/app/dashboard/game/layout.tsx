import { ReactNode, memo, useMemo } from "react";
import JotaiProvider from '@/app/dashboard/game/context/jotai';
import { GameProvider } from "./context/gameContext";

interface LayoutProps {
    children: ReactNode;
}

const MemoizedLayout = memo(Layout);

function Layout({ children }: LayoutProps) {
  const mimoizedChildren = useMemo(() => children, [children]);

  return (
    <GameProvider>
      <JotaiProvider>
          {mimoizedChildren}
      </JotaiProvider>
    </GameProvider>
  );
}

export default MemoizedLayout;