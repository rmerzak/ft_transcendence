"use client";
import { PlusCircle, User, } from "lucide-react";
import { useRef, useState, useEffect, FormEvent } from "react";
import { UsersAPIService } from "../../api/users/users.api";
import { CloudinaryAPIService } from "@/api/cloudinary/cloudinary.api";

const PreAuthForm = () => {
  const [user, setUser] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState("");
  const [fil, setFile] = useState<File>();
  //const [checked, setChecked] = useState<boolean>(user.isVerified);
  
  const [newUsername, setUsername] = useState<string>("");
  const [twoFa, settwoFa] = useState<boolean>(false);
  const handleImageClick = () => {
    inputRef.current!.click();
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFile(file);
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    UsersAPIService.getVerify().then((res) => { setUser(res.data); setImage(res.data.image); }).catch((err) => { console.log(err) });
  }, []);

  let ii = user.image;
  async function handleSubmit(event:any) {
    event.preventDefault();
    try {
      if (fil != undefined) {
        const formData = new FormData();
        formData.append("file", fil!);
        formData.append("upload_preset", "ping_users");
        // await CloudinaryAPIService.PostImage(formData).then((res) => { setImage(res.data.url);seter(res.data.url) }).catch((err) => { console.log(err) });
        ii = await CloudinaryAPIService.ImageName(formData);
      }
      const UserData = new FormData();
      UserData.append("username", newUsername);
      UserData.append("twoFa", twoFa.toString());
      UserData.append("image", ii);
      UsersAPIService.postFinishAuth(UserData).then((res) => { console.log(res); }).catch((err) => { console.log(err) });
    } catch (error) {
      console.log(error);
    }
  }

  async function logout() {
    try {
      await UsersAPIService.logout();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="bg-[#311251] drop-shadow-2xl w-[380px] md:w-[500px] bg-opacity-50 pb-10 rounded-2xl  flex items-center justify-center flex-col max-w-4xl">

      <div onClick={handleImageClick} className="w-[150px]  h-[150px] rounded-full">
        <img src={image} className="rounded-full" />
        <label htmlFor="file"></label>
        <input type="file"
          onChange={(e) => handleImageChange(e)}
          id="file" ref={inputRef} className="hidden" />
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50px] rounded-full bg-white"><PlusCircle color="#7a7a7a" /></div>
      </div>

      <div className="flex items-center bg-white mt-6 border-[0.063rem] rounded-[1rem] overflow-hidden relative ">
        <label htmlFor="name"></label>
        <input type="text" onChange={(e) => { setUsername(e.target.value); }} id="name" placeholder={`default: ${user.username}`} className="w-[20.438rem] h-[2.75rem] pl-[1.063rem] leading-normal" />
        <User className="absolute right-3" />
      </div>

      <div className="pt-5">
        <label htmlFor="factor" className="relative inline-flex items-center cursor-pointer">
          <input id="factor" onChange={(e) => { settwoFa(e.target.checked); }} type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-bold font-medium text-white dark:text-gray-300">Two authentication factor</span>
        </label>
      </div>

      <div className="pt-5 flex items-center justify-between w-[20.438rem] h-[2.75rem] ">
        <button onClick={logout} className="bg-[#79196F]  w-[100px] h-[40px] text-white py-2 px-4 rounded-[10px]">Return</button>
        <button type="submit" className="bg-[#79196F] w-[100px] h-[40px] text-white py-2 px-4 rounded-[10px]">Continue</button>
      </div>


    </form>
  )
}

export default PreAuthForm