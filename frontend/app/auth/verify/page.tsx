import axios from "axios";
import { cookies } from "next/headers";
async function getAuthData() {
  const cookie = cookies();
  const response = await axios.get('http://localhost:3000/auth/verify', {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Cookie: cookies()
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join('; '),
    },
  });
  console.log(response);
  // if (response.ok) {
  //   const res = await response.json();
  //   return res;
  // } 
}


const Verify = async () => {
  const user = await getAuthData();
  //console.log(user);
  return (
    <div className="h-[500px] w-full bg-red-400">
    </div>
  );
};

export default Verify;
