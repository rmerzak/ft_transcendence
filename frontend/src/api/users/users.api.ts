import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
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

}

export const UsersAPIService = new UsersService();