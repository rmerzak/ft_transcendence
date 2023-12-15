
const Profile = () => {
  return (
    <div className="bg-mberri py-8 mx-2">
      <div className='text-white font-bold text-[28px] text-center'>
          Profile
      </div>
      <div className="relative">
        <div className="relative">
              <img src="/bg_ping-pong.png" alt="pingpong" className="w-full object-cover"/>
          <div className="absolute  p-4 text-white grid font-bold grid-cols-4 flex justify-center text-center" style={{fontSize: '1vw', top: '60%', left: '20%'}}>
          <div>
            <p className="text-pink-700">First Name</p>
                  <p>Name</p>
          </div>
          <div>
            <p className="text-pink-700">Last Name</p>
            <p>Name</p>
          </div>
          <div>
            <p className="text-pink-700">Nick Name</p>
            <p>Name</p>
          </div>
          <div>
            <p className="text-pink-700">Email</p>
            <p>test@student.1337.ma</p>
          </div>
        </div>
        </div>
        <div className="absolute" style={{width: '12%', height: '12%',top: '35%', left: '6%'}}>
          <img src="/dfpic.png" alt="profile" className="w-full object-cover"/>
          <div className="absolute" style={{width: '17%', height: '17%',top: '220%', left: '70%'}}>
            <div className="relative">
              <img src="/green_icon.png" alt="green" className="w-full  object-cover"/>
            </div>
          </div>
        </div>
        <div className="absolute" style={{width: '7%', height: '7%',top: '25%', left: '86%'}}>
            <p className="text-gray-400 text-center" style={{fontSize: '2vw'}}>Freax</p>
            <img src="/freax.png" alt="freax" className="w-full object-cover"/>
          </div>
      </div>
    </div>
  )
}

export default Profile