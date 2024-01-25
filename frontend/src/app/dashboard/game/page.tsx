import Play from '@/components/game/Play';

const Game = () => {
  return (
    <>
        <div className='w-[96%] h-screen mx-auto mt-6 text-center p-[1%] shadow-md rounded-3xl bg-[#311251]/80  relative top-[45%] -translate-y-[50%] border' >
          <h1 className='text-3xl font-black text-white m-4 '>
            Game
          </h1>
          <Play />
        </div>
    </>
  );
};

export default Game;




{/*import Play from '@/components/game/Play';

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

export default Game;*/}
