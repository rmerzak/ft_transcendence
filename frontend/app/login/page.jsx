const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 hero-gradient">
      <div className="flex flex-col items-center justify-center w-full flex-1 px-5 md:px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl">
          <div className="flex items-center w-full md:w-3/5 p-5">
            <img src="/game.gif" alt="game" />
            </div>
          <div className="w-full md:w-2/5 bg-green-500 text-white rounded-t-2xl  rounded-b-2xl md:rounded-tr-2xl  py-5 md:py-36 px-5 md:px-12">
            <h2 className="text-3xl font-bold mb-2">Welcome, Player!</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-5 md:mb-10">Serve up your ping pong journey! 🏓 #GameOn</p>
            <a href="#" className="border-2 border-white rounded-full px-6 py-2 inline-block font-semibold hover:bg-white hover:text-green-500">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
