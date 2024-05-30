import axios from 'axios'
import { getToken } from '../cookies';
// import { useRecoilValue, useSetRecoilState } from 'recoil';
// import { userState,userDetailsState } from '@/store/atoms/user';
import dotenv from "dotenv"
dotenv.config();
import { BASEURL } from "../config"
const baseURL=BASEURL
const token = getToken();
export const placeOrder = async (addressId:number) => {
    try {
        const res = await axios.post(`${baseURL}/user/order`,{addressId}, {
            headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${token}`
            }
        })
        if (res.status === 201) {
           

            return {orderId:res.data.orderId,message:res.data.message};
        } else {
            return {error:res.data.error} || 'Unexpected error occurred';
        }
    } catch (error:any) {
        throw new Error('Invalid input or unexpected error');
    }
}

export const getOrders = async () => {
    try {
        const res = await axios.get(`${baseURL}/user/order`, {
            headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${token}`
            }
        })
        if (res.status === 201) {
            return {orders:res.data.orders};
        } else {
            return res.data.error || 'Unexpected error occurred';
        }
    } catch (error:any) {
        throw new Error('Invalid input or unexpected error');
    }
}

export const getOrder = async (orderId:number) => {
    try {
        const res = await axios.get(`${baseURL}/user/order/${orderId}`, {
            headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${token}`
            }
            
        })
       
        if (res.status === 201) {
            return res.data.orderDetails;
          
        } else {
            return res.data.error || 'Unexpected error occurred';
        }
    } catch (error:any) {
        throw new Error('Invalid input or unexpected error');
    }
}