import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      console.error('Invalid token:', error);
      document.cookie = 'accesstoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    }
    return Promise.reject(error);
  }
);
class UsersService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.API_BASE_URL,
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        });
        this.axiosInstance.interceptors.response.use(
            (response) => {
              return response;
            },
            (error) => {
              const { response } = error;
          
              if (response && response.status === 401) {
                console.error('Invalid token:', "i m here");
              }
              return Promise.reject(error);
            }
          );
    }
    private async axiosCall<T>(config: AxiosRequestConfig) {
        try {
            const { data } = await this.axiosInstance.request<T>(config);
            return { error: null, data: data };
        } catch (error) {
            return { error };
        }
    }
    async getVerify(): Promise<any> {
        console.log(process.env.API_USER_VERIFY);
        return await this.axiosCall<any>({ url: process.env.API_USER_VERIFY , method: "GET" });
    }

    async postFinishAuth(data: any): Promise<any> {
        return await this.axiosCall<any>({ url: process.env.API_USER_FINISH_AUTH, method: "POST", data });
    }
    async logout(): Promise<any> {
        return await this.axiosCall<any>({ url: process.env.API_USER_LOGOUT, method: "GET" });
    }
    async validateToken(data: any): Promise<any> {
        return await this.axiosCall<any>({ url: process.env.API_USER_VALIDATE_TOKEN, method: "POST", data });
    }

}

export const UsersAPIService = new UsersService();