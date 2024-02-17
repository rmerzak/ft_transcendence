import AuthWrapper from '@/components/auth/AuthWrapper';
import Play from '@/components/game/Play';

const Game = () => {
  return (
    <AuthWrapper>
  
        <div className='w-[95%] h-[90%] overflow-auto mx-auto m-6 pb-16 text-center p-[1%] shadow-md rounded-3xl bg-[#311251]/80 backdrop-blur-md' >
          <h1 className='text-3xl font-black text-white m-4 '>
            Game
          </h1>
          <Play />
        </div>
    </AuthWrapper>
  );
};

export default Game;