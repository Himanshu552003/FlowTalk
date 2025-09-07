import {axiosInstance} from "./axios"

export async function getStreamToken(){
    const respone= await axiosInstance.get("/chat/token");
    return respone.data;
}