"use client";
import { PlusCircle, User, } from "lucide-react";
import { useRef, useState, useEffect, FormEvent, useContext } from "react";
import { UsersAPIService } from "../../api/users/users.api";
import { CloudinaryAPIService } from "@/api/cloudinary/cloudinary.api";
import TwoFaPopUp from "./TwoFaPopUp";
import { Switch } from '@headlessui/react'
import { useRouter } from "next/navigation";
import axios from "axios";
import { ContextGlobal } from "@/context/contex";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const PreAuthForm = ({ exit }: { exit: boolean }) => {
  const router = useRouter();
  const [user, setUser] = useState<any>("");
  const { profile, setProfile }: any = useContext(ContextGlobal);
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string>("");
  const [fil, setFile] = useState<File>();
  const [open, setOpen] = useState<boolean>(false);
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [secret, setSecret] = useState('');
  const [newUsername, setUsername] = useState<string>("");
  const fetchQrCode = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/2fa/generate', {
        withCredentials: true,
      });
      console.log(response.data);
      const imageUrl = response.data.uri;
      setQrCodeImage(imageUrl);
      setSecret(response.data.secret);
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  };

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
    UsersAPIService.getVerify().then((res) => { setUser(res.data); setImage(res.data.image);}).catch((err) => { router.push("/"); });
  }, []);

  let ii = user?.image;
  async function handleSubmit(event: any) {
    event.preventDefault();
    try {
      if (fil != undefined) {
        const formData = new FormData();
        formData.append("file", fil!);
        formData.append("upload_preset", "ping_users");
        ii = await CloudinaryAPIService.ImageName(formData);
      }
      const response = await axios.post('http://localhost:3000/auth/finish-auth', { image: ii, username: newUsername }, {
        withCredentials: true,
      });
      if (response.data.isVerified === true) {
        setProfile(response.data); // must find the error here
        if(exit == true)
          router.push('/dashboard/profile');
        else{
          toast("Profile updated successfully!")
        }
          
      }
      else
        router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  async function logout(event: any) {
    try {
      event.preventDefault();
      await UsersAPIService.logout();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit} className="bg-[#311251] drop-shadow-2xl w-[260px] md:w-[500px] bg-opacity-50 pb-10 rounded-2xl  flex items-center justify-center flex-col max-w-4xl">

        <div onClick={handleImageClick} className="w-[100px]  h-[100px] md:w-[150px]  md:h-[150px] rounded-full">
          <img src={image} className="rounded-full" />
          <label htmlFor="file"></label>
          <input type="file"
            onChange={(e) => handleImageChange(e)}
            id="file" ref={inputRef} className="hidden" />
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50px] rounded-full bg-white"><PlusCircle color="#7a7a7a" /></div>
        </div>

        <div className="flex items-center bg-white mt-6 border-[0.063rem] rounded-[1rem] overflow-hidden relative ">
          <label htmlFor="name"></label>
          <input type="text" onChange={(e) => { setUsername(e.target.value); }} id="name" placeholder={`default: ${user?.username}`} className="w-[15.438rem] h-[2.5rem] md:w-[20.438rem] md:h-[2.75rem] pl-[1.063rem] leading-normal" />
          <User className="absolute right-3" />
        </div>

        <div className="pt-5">
          <Switch
            checked={open}
            onChange={setOpen}
            onClick={fetchQrCode}
            className={`${open ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}>
            <span className="sr-only">Enable notifications</span>
            <span
              className={`${open ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
          </Switch>
          <span className="ms-3 text-bold font-medium text-white dark:text-gray-300">Generate new 2FA secret</span>
        </div>
        <div className={`pt-5 flex items-center justify-between ${exit == true ? "justify-between" : "justify-around"} w-[20.438rem] h-[2.75rem] `}>
          {exit == false ? "" : <button onClick={logout} className={`bg-[#79196F]  w-[100px] h-[40px] text-white py-2 px-4 rounded-[10px] `}>Return</button>}
          <button type="submit" className="bg-[#79196F] w-[100px] h-[40px] text-white py-2 px-4 rounded-[10px]">{exit == false ? "Update" : "Continue"}</button>
        </div>
      </form>
      <TwoFaPopUp open={open} onClose={() => setOpen(false)} image={qrCodeImage} secret={secret} />
      <ToastContainer />
    </>
  )
}

export default PreAuthForm