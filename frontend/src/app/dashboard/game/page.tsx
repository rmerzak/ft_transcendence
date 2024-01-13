import Play from '@/components/game/Play';

const Game = () => {
  return (
    <>
        <div className='w-[88% mx-auto text-center p-[1%] shadow-md rounded-3xl bg-[#311251]/80 absolute top-[50%] -translate-y-[50%]' >
          <h1 className='text-3xl font-black text-white m-4'>
            Game
          </h1>
          <Play />
        </div>
    </>
  );
};

export default Game;
