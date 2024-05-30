import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import avatar from '../../img/avatar.png'
import logo from '../../public/android-chrome-512x512.png'
import { navItems } from '../utils/navItems'
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { useRouter } from 'next/router';
import { getToken, removeToken } from '@/cookies';
import { FaBars } from 'react-icons/fa';
import ShoppingCart from '@/utils/icons/cartIcon'


function Navigation({ active, setActive }: { active: number, setActive: Function }) {
    const [isUserLoggedIn, setisUserLoggedin] = useState("")
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const token = getToken();
    const router = useRouter()
    function handleSignOut() {
        removeToken()
        router.push("/")
       

    }

    function handleLogin() {
        router.push("/Auth")
    }
    useEffect(() => {
        const token = getToken()
        setisUserLoggedin(token)
    })
    return (
        <>

            <div className="flex flex-row  justify-between gap-4 sm:flex sm:justify-between  h-32  " style={{ background: "transparent" }} >

                {/* Hamburger icon for mobile view */}

                <div className="sm:hidden   ">
                    <FaBars className={`cursor-pointer text-[#F7DB3D] mt-12 ml-12 h-8 w-8 ${mobileMenuOpen ? "hidden" : "block"}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
                </div>

                {/* User container */}
                <div className={`user-con mt-4 ml-4 h-20 w-20 sm:h-20 sm:w-20 ${mobileMenuOpen ? 'sm:block' : 'block'}`}>
                    <img src={logo.src} alt="Logo" />
                </div>
                {mobileMenuOpen && (
                    <div className={`flex flex-col fixed top-0 left-0 w-full h-auto p-10 bg-[#524f4abb] bg-opacity-80 transition-transform duration-300 ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                        <div className="ml-8 mt-8">
                            <ul>
                                {navItems.map((item: any) => (
                                    <li
                                        key={item.id}
                                        onClick={() => {
                                            router.push(`/${item.link}`);
                                            setMobileMenuOpen(false);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                        className={`mt-4 sm:mt-10 ${active === item.id ? 'active' : ''} sm:ml-20 text-[#F7DB3D]`}
                                    >
                                        <div className="dripnav text-[2rem] justify-between text-center">
                                            <span>{item.title}</span>

                                        </div>

                                    </li>
                                ))}

                                <li className={`mt-4 sm:mt-10  sm:ml-20 text-[#F7DB3D] dripnav text-[2rem] justify-between text-center ${token ? "block" : "hidden"}`} onClick={() => {
                                    router.push(`/Cart`);
                                    setMobileMenuOpen(false);
                                }}>Cart</li>
                            </ul>
                        </div>
                    </div>
                )}


                <div className={`  sm:justify-between    sm:ml-24 hidden sm:block`}>

                    <ul className={`sm:flex sm:flex-row`}>
                        {navItems.map((item: any) => (
                            <li
                                key={item.id}
                                onClick={() => {
                                    router.push(`/${item.link}`)
                                    setMobileMenuOpen(false);
                                }}
                                style={{ cursor: 'pointer' }}
                                className={`sm:mt-10 ${active === item.id ? 'active' : ''} sm:ml-20 text-white`}
                            >
                                <div className='dripnav'>
                                    <span >{item.title}</span>

                                </div>
                            </li>

                        ))}

                    </ul>
                </div>


                <div className={` pt-6 pr-8  sm:mt-8   sm:justify-self-end sm:mr-10 text-white ${mobileMenuOpen ? "hidden" : "block"}`}>

                    {isUserLoggedIn === undefined || "" ? (
                        <button onClick={handleLogin} className="cursor-pointer text-black  w-16 sm:w-20 sm:-mt-1   sm:ml-4">
                            Log In
                        </button>
                    ) : (
                        <>
                            <div className='sm:flex sm:flex-row sm:justify-center sm:w-48 sm:-mt-4 '>

                                <ShoppingCart />
                                <button onClick={handleSignOut} className="cursor-pointer text-black sm:w-auto sm:-mt-1 sm:ml-4 p-2 w-full">

                                    Sign Out
                                </button>

                            </div></>
                    )}
                </div>
            </div>

        </>
    )
}



export default Navigation