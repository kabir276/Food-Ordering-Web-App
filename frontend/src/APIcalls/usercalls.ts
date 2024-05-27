import axios from 'axios'
import { getToken, setToken } from '../cookies';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '@/store/atoms/user';
import dotenv from "dotenv"
import { toast } from 'react-toastify';
import router from 'next/router';
import { userDetailsState } from '@/store/atoms/userDetails';
dotenv.config();
import { BASEURL } from "../config"
const token = getToken() || null;

export const useUserRecoilState = () => {
    const setUser = useSetRecoilState(userState);
    const setUserDetails = useSetRecoilState(userDetailsState);

    return { setUser, setUserDetails };
};
export const signup = async (username: string, phoneNumber: number, setUser: Function) => {
    try {
        console.log(username, phoneNumber)

        const res = await axios.post(`${BASEURL}/user/signup`, {
            username, phoneNumber
        }, {
            headers: {
                "Content-type": "application/json"
            }
        })
        if (res.status === 201) {
            setUser({
                isLoading: false,
                userNumber: phoneNumber
            })
            console.log(res.data.message)
            toast.success(res.data.message)
            router.push("/Otpverify");


        } else {
            toast.error(res.data.error)

        }
    } catch (error: any) {
        console.error('Error:', error.message || error);
        throw new Error('Invalid input or unexpected error');
    }

}
export const verifyOtp = async ( phoneNumber: number,otp: number,) => {
    try {
        const res = await axios.post(`${BASEURL}/user/verify-otp`, {
            phoneNumber: phoneNumber,
            otp: otp
        }, {
            headers: {
                "Content-type": "application/json"
            }
        });

        if (res.status === 201) {
            toast.success(res.data.message)
            setToken(res.data.token);

        } else {
            toast.error(res.data.error || "Unexpected error occurred")

        }
    } catch (error: any) {
        toast.error("Unexpected error occurred")
        console.error('Error:', error.message || error);
        throw new Error('Invalid input or unexpected error');
    }
};
export const resendOtp = async (phoneNumber: number) => {
    try {
        const res = await axios.post(`${BASEURL}/user/resnd-otp`, {
            phoneNumber,
        }, {
            headers: {
                "Content-type": "application/json"
            }
        });

        if (res.status === 201) {
            toast.success(res.data.message)
            setToken(res.data.token);

        } else {
            toast.error(res.data.error || "Unexpected error occurred")

        }
    } catch (error: any) {
        toast.error("Unexpected error occurred")
        console.error('Error:', error.message || error);
        throw new Error('Invalid input or unexpected error');
    }
};
export const signin = async (phonenumber: number, setUser: Function) => {
    try {

        const res = await axios.post(`${BASEURL}/user/signin`, {
            phoneNumber: phonenumber
        }, {
            headers: {
                "Content-type": "application/json"
            }
        })
        if (res.status === 201) {
            setUser({
                isLoading: false,
                userNumber: phonenumber
            })
            console.log(res.data.message)
            toast.success(res.data.message)
            router.push("/Otpverify");

        } else {
            toast.error(res.data.error)

        }
    }
    catch (error: any) {
        console.error('Error:', error.message || error);
        throw new Error('Invalid input or unexpected error');
    }
}
export const setuserdata = async (setUserDetails: Function) => {
    try {

        const res = await axios.get(`${BASEURL}/user/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        if (res.status === 201) {
            setUserDetails({
                isLoading: false,
                userData: res.data.userdetails
            })

        } else {
            toast.error(res.data.error)


        }
    }
    catch (error: any) {
        toast.error('Invalid input or unexpected error')

        console.error('Error:', error.message || error);
        throw new Error('Invalid input or unexpected error');
    }
}

