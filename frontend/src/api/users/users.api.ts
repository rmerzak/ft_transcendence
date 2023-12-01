import axios, {AxiosInstance, AxiosRequestConfig} from "axios";

 class UsersService{
    private  axiosInstance: AxiosInstance;

   constructor() {
        this.axiosInstance = axios.create({
            baseURL: "http://localhost:3000",
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    private async axiosCall<T>(config: AxiosRequestConfig) {
        try {
        const { data } = await this.axiosInstance.request<T>(config);
        return {error :null, data: data};
        } catch (error) {
        return {error};
        }
    }
    async getVerify(): Promise<any> {
        return await this.axiosCall<any>({url: "/auth/verify", method: "GET"});
    }
}

export const UsersAPIService = new UsersService();