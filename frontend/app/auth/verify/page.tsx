'use cli'
import axios from "axios";
import { cookies } from "next/headers";
const api = axios.create({
  headers: {
  Cookie: cookies()
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join('; '),
    },
});
async function getAuthData() {
  const cookie = cookies();
  const response = await api.get('http://localhost:3000/auth/verify'

  );
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
