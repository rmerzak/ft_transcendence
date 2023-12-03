import axios from "axios";
class CloudinaryService {
    constructor() {}
    async PostImage(image : any): Promise<any> {
        return await axios.post(`${process.env.API_Cloudinary_URL}`, image);
    }

}

export const CloudinaryAPIService = new CloudinaryService();