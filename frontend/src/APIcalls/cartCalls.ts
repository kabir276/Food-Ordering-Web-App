import axios from 'axios'
import { getToken } from '../cookies';
import { useRouter } from "next/router";
import z from "zod";
import dotenv from "dotenv"
// import { cartState } from '@/store/atoms/cart';
dotenv.config();
import { BASEURL } from "../config"
import { Router } from 'next/router';
const baseURL=BASEURL
const token  = getToken();



const cartItemsSchema = z.object({
    menuItemId: z.number().min(1).max(99),
    quantity: z.number().min(1).max(99)
})
export const addItem = async (menuItemId: number, quantity: number) => {
    
    try {
       

        
        const inputCheck = cartItemsSchema.parse({ menuItemId, quantity });


      

        const res = await axios.post(
            `${baseURL}/user/cart`,
            {
                menuItemId: inputCheck.menuItemId,
                quantity: inputCheck.quantity,
            },
            {
                headers: {
                    'Content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            }
        );

        if (res.status === 201) {
            return res.data.message,res.data.cartID;
        } else {
            return {error:res.data.error} || 'Unexpected error occurred';
        }
    } catch (error: any) {
        
        throw new Error('user not authorized');
    }
};
export const updateCart = async (cartId: number, quantity: number) => {
    try {
       

       

        const res = await axios.put(
            `${baseURL}/user/cart/${cartId}`,
            {
                quantity: quantity,
            },
            {
                headers: {
                    'Content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            }
        );
        if (res.status === 201) {
            return res.data;
        } else {
            return res.data.error || 'Unexpected error occurred';
        }
    } catch (error:any) {
        throw new Error('Invalid input or unexpected error');
    }
};

export const deleteCart = async (cartId: number) => {
    try {
        const res = await axios.delete(
            `${baseURL}/user/cart/${cartId}`,
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
    } catch (error:any) {
        throw new Error('Invalid input or unexpected error');
    }
};
export const getCart = async () => {
    try {
        const res = await axios.get(
            `${baseURL}/user/cart`,
            {
                headers: {
                    'Content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            }
        );
           
        if (res.status === 201) {
            return res.data;
        } else {
            return "Your cart is empty add Item" ;
        }
    } catch (error:any) {
        throw new Error('Invalid input or unexpected error');
    }
};

