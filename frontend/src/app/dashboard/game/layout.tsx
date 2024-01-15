import { ReactNode } from "react";
import { GameProvider } from './context/gameContex';
import JotaiProvider from '@/app/dashboard/game/context/jotai';

interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <GameProvider>
        <JotaiProvider>
            {children}
        </JotaiProvider>
    </GameProvider>
  );
}

export default Layout;