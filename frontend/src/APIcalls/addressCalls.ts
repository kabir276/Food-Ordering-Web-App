import axios from 'axios'
import { getToken } from '../cookies';
import { useSetRecoilState } from 'recoil';
import z from "zod";
import dotenv from "dotenv"
// import { addressState } from '@/store/atoms/address';
dotenv.config();
// const setAddress = useSetRecoilState(addressState);

import { BASEURL } from "../config"
const baseURL=BASEURL
const token  = getToken();

const addressSchema = z.object({
    street: z.string(),
    housenumber: z.string(),
    postalcode: z.number(),
    city: z.string(),
  });

export const addAddress = async (street: string, housenumber: string,postalcode:number,city:string) => {
    try {
        const inputCheck = addressSchema.parse({ street, housenumber,postalcode,city });

       

        const res = await axios.post(
            `${baseURL}/user/address`,
            {
                street: inputCheck.street,
                housenumber: inputCheck.housenumber,
                postalcode:inputCheck.postalcode,
                city:inputCheck.city
            },
            {
                headers: {
                    'Content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            }
        );

        if (res.status === 201) {
            return res.data.message;
        } else {
            return res.data.error || 'Unexpected error occurred';
        }
    } catch (error: any) {
        throw new Error('Invalid input or unexpected error');
    }
};
export const updateAddress = async (addressID:number,street: string, housenumber:string, postalcode:number,city:string) => {
    try {
        const inputCheck = addressSchema.parse({ street, housenumber,postalcode,city });

        

        const res = await axios.put(
            `${baseURL}/user/address/${addressID}`,
            {
                street: inputCheck.street,
                housenumber: inputCheck.housenumber,
                postalcode:inputCheck.postalcode,
                city:inputCheck.city
            },
            {
                headers: {
                    'Content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            }
        );

        if (res.status === 201) {
            return res.data.message;
        } else {
            return res.data.error || 'Unexpected error occurred';
        }
    } catch (error: any) {
        throw new Error('Invalid input or unexpected error');
    }
};
export const getAddress = async (addressID:number) => {
    try {
    
        const res = await axios.get(
            `${baseURL}/user/address/${addressID}`,
            {
                headers: {
                    'Content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            }
        );

        if (res.status === 201) {
            //  setAddress({
            //     isLoading: false,
            //     details: res.data.address
            //  })
            return res.data;
        } else {
            return res.data.error || 'Unexpected error occurred';
        }
    } catch (error: any) {
        throw new Error('Invalid input or unexpected error');
    }
};

export const getAddresses = async () => {
    try {
       
        const res = await axios.get(
            `${baseURL}/user/address`,
            {
                headers: {
                    'Content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            }
        );

        if (res.status === 201) {
            //  setAddress({
            //     isLoading: false,
            //     details: res.data.address
            //  })
            return res.data;
        } else {
            return res.data.error || 'Unexpected error occurred';
        }
    } catch (error: any) {
        throw new Error('Invalid input or unexpected error');
    }
};
export const deleteAddress = async (addressID:number) => {
    try {
    
        const res = await axios.delete(
            `${baseURL}/user/address/${addressID}`,
            {
                headers: {
                    'Content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            }
        );

        if (res.status === 201) {
             
            return res.data.message;
        } else {
            return res.data.error || 'Unexpected error occurred';
        }
    } catch (error: any) {
        throw new Error('Invalid input or unexpected error');
    }
};