import axios from "axios"

export const axiosinstance = axios.create({});

export const apiConnector  = (method , url , bodyData , headers , params  )=>{
 return axiosinstance({
    method:`${method}`,
    url:`${url}`,
    data:bodyData ?bodyData:null,
    headers:headers?headers:null,
    params:params? params:null
 })
}
// initially we use this for every single route 
// const response = await axios.post(
//    "https://food-restaurent-xi.vercel.app/api/v1/auth/login",
//    formData
//  );