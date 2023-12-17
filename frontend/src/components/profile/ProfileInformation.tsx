const ProfileInformation = () => {     
    return (     
    <div className="text-white bg-mberri flex items-center justify-around">
       <div className="relative">
            <img src="/dfpic.png" alt="default pic" style={{width: "100px", height: "100px"}}/>
            <div className="absolute" style={{top: "75px", right: "8px", width: "20px", height: "20px"}}>
                <img src="/green_icon.png" alt="green-icon"/>
            </div>
       </div>
       <div className="bg-mberri1 flex justify-between items-end">
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
       <div>
       <p className="text-gray-400 text-center" style={{fontSize: '1.8vw'}}>Freax</p>
       <img src="/freax.png" alt="freax" style={{width: "60px", height: "110px"}}/>
       </div>
    </div>
    )
}

export default ProfileInformation

