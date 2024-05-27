import { userState } from '@/store/atoms/user';
import '@/styles/globals.css'
import axios from 'axios';
import type { AppProps } from "next/app";
import { useEffect, useState } from 'react';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { BASEURL } from "../config";
import {getToken} from "../cookies"
import { userDetailsState } from '@/store/atoms/userDetails';
import Navigation from '@/components/navigation';
import { useRouter } from 'next/router';
export default function App({ Component, pageProps }: AppProps) {
  return <RecoilRoot>
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <Component {...pageProps} />
    <InitUser/>
  </RecoilRoot>;;
}
function InitUser() {
  const token=getToken()
  const setUser = useSetRecoilState(userDetailsState);
  const init = async() => {
      try {
          const response = await axios.get(`${BASEURL}/user/`, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
          })

          if (response.data) {
              setUser({
                  isLoading: false,
                  userData: response.data
              })
          } else {
              setUser({
                  isLoading: false,
                  userData: null
              })
          }
      } catch (e) {

          setUser({
              isLoading: false,
              userData: null
          })
      }
  };

  useEffect(() => {
      init();
  }, []);
 
  return <>
 </>
}