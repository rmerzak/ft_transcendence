import { User } from "./interfaces";
import { Valid } from "./middleware";


export async function isValidAccessToken(accessToken: string | undefined): Promise<Valid> {
  if(accessToken === undefined || accessToken === null) return { error: true, user: {} as User };
  try {
      // const response = await fetch(`http://backend:3000/auth/validateToken`, {
      const response = await fetch(`http://localhost:3000/auth/validateToken`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      const result = await response.json();
  
      if (response.status === 401) {
        return { error: true, user: {} as User};
      }
  
      return {error: false, user: result.user as User};
    } catch (error) {
      return { error: true, user: {} as User};
    }
  }