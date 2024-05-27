import Image from "next/image";
import { Inter } from "next/font/google";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ArrowUpIcon from "../../public/icons8-forward-arrow-32.png"
import homeimg from "../../public/pngtree-beef-tortilla-roll-with-salad-food-illustration-png-image_10235559.png"
import Navigation from "@/components/navigation";
const inter = Inter({ subsets: ["latin"] });
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Main from "@/components/main";

export default function Home() {

  const [active, setActive] = useState(1)
const router =useRouter()
useEffect(() => {
  
  const handleRouteChange = () => {
    window.location.reload();
  };
  router.events.on('routeChangeComplete', handleRouteChange);
  return () => {
    router.events.off('routeChangeComplete', handleRouteChange);
  };
}, [router.events]);
  return (
    <div style={{}}>
    
      <Navigation active={active} setActive={setActive} />
      <div className="flex flex-col sm:flex-row justify-around sm:min-h-[100%] sm:px-24 p-5 text-center sm:text-left" style={{ background: "#121212", display: "flex" }}>
        <div className=" sm:w-1/2   sm:mt-0 ml-5">
          <h1 className="text-white text-3xl sm:text-7xl">The taste of tradition, with a modern twist.</h1 >
          <p className="text-[#ffe676] text-xl sm:text-xl sm:w-[35rem] sm:mt-3 ">Indulge in a culinary journey that seamlessly blends heritage flavors with contemporary flair, elevating the essence of tradition to a new level of gastronomic delight.</p>
          
            <div className=" p-6 pl-8  flex flex-row-reverse" >
              <button onClick={()=>{router.push('/Menu')}} className="bg-transparent text-2xl  sm:ml-4 align-middle w-48 "  style={{ color: "#ffff" }}>Check Out Menu </button>
              <img src={ArrowUpIcon.src} alt="" className="w-6 h-6  sm:-ml-4 mt-7" />
            </div>
      
        </div>
        <div className=" sm:mt-18" style={{}}>
          <img src={homeimg.src} className="sm:w-96 sm:h-96 sm:" alt="" />
        </div>
      </div>
    </div>
  );
}
