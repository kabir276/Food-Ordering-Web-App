import axios from 'axios'
import { getToken } from '../cookies';
// import { useRecoilValue, useSetRecoilState } from 'recoil';
// import { userState,userDetailsState } from '@/store/atoms/user';
import dotenv from "dotenv"
dotenv.config();
import { BASEURL } from "../config"
const baseURL=BASEURL
const  token = getToken();
export const getMenu = async () => {
    try {
        const res = await axios.get(`${baseURL}/user/menu`, {
            headers: {
                "Content-type": "application/json",
            }
        })
        if (res.status === 201) {
            return res.data.menu;
        } else {
            return res.data.error || 'Unexpected error occurred';
        }
    } catch (error:any) {
        console.error('Error:', error.message || error);
        throw new Error('Invalid input or unexpected error');
    }

}
export const getMenuItem = async (menuItemId:number) => {
    try {
        const res = await axios.get(`${baseURL}/user/menu/${menuItemId}`, {
            headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${token}`
            }
        })
        if (res.status === 201) {
            return res.data.menuItem;
        } else {
            return res.data.error || 'Unexpected error occurred';
        }
    } catch (error:any) {
        console.error('Error:', error.message || error);
        throw new Error('Invalid input or unexpected error');
    }

}