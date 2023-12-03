import axios from "axios";
class CloudinaryService {
    constructor() {}
    async PostImage(image : any): Promise<any> {
        return await axios.post(`${process.env.API_Cloudinary_URL}`, image);
    }
    async ImageName(image : any): Promise<string> {
        return await axios.post(`${process.env.API_Cloudinary_URL}`, image).then((res) => {return res.data.url}).catch((err) => {return err});
    }

}

export const CloudinaryAPIService = new CloudinaryService();