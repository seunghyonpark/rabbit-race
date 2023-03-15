"use client";
import API from '@/libs/enums/API_KEY'
import Coin from '@/libs/enums/coin.enum';
import { IUser } from '@/libs/interface/user'
import { hasCookie, getCookie, deleteCookie } from 'cookies-next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import Wallet from "../../components/Wallet";
import { useListen } from "../../hooks/useListen";
import { useMetamask } from "../../hooks/useMetamask";


export default function MobilNavbar() {
    //const { dispatch } = useMetamask();
    //const listen = useListen();


    const [user, setUser] = useState<IUser>()
    const router = useRouter();

    const getUser = async () => {
        if (hasCookie("user")) {
            const inputs = {
                method: 'getOne',
                API_KEY: API.key,
                userToken: getCookie('user')
            }
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs)
            })
            const user = await res.json()
            setUser(user.user.user)
        }
    }


    useEffect(() => {
        getUser();
    });









    return (
        <>
            <div className="lg:hidden w-full flex items-center gap-2 px-2 h-20 bg-[#24252F]">

                <Link href={"/"}>
                    <Image src={"/logo.png"} width={80} height={100} alt="logo" />
                </Link>

                
                <div className='w-full p-2 flex items-center justify-end gap-3'>

aaa

                    {/*
                        user && <Link
                            href={"/gameT2E/deposit"}
                            className={`text-[13px] text-[#dca709] `}
                        >
                            Connect Wallet
                        </Link>
    */}




                    {
                        user && 
                        <div className="flex flex-row">
                        <Image
                            src={'/metamask.png'}
                            width={20}
                            height={20}
                            alt="pp"
                            className="rounded-full"
                        />
                        
                        <button
                        className={` ml-2 text-[8px] text-orange-500 `}
                        onClick={() => {
                            //deleteCookie('user'), router.push('/')







                        }}
                        >
                            Connect Wallet
                        </button>
                        </div>
                    }




                    {
                        user && <div
                            className={`flex items-center justify-center  bg-black rounded-md h-[32px] text-[13px] text-center px-5 text-[#BA8E09] border border-[#BA8E09] `}
                        >
                            {`${user.deposit.toString().slice(0, 3)}...`}&nbsp;&nbsp;<span className="text-[#9293A6]">{" "}{Coin.symbol}</span>
                        </div>
                    }


                    {
                        
                        !user && <Link
                            href={"/gameT2E/login"}
                            className={`text-[10px] text-[#9293A6]  border-t-2 border-green-500 p-1`}
                        >
                            Sign In
                        </Link>
                        
                    }

                    {/*
                        
                        !user && <Link
                            href={"/gameT2E/register"}
                            className={`text-[13px] text-[#9293A6]  border-t-2 border-yellow-500 p-1`}
                        >
                            Sign Up
                        </Link>
                        
                */}
                     {
                        user && <div
                            //href={"/gameT2E/profile"}
                            
                            className={`flex items-center shadow-sm  justify-center rounded-md p-1 gap-2  h-[36px] px-2 text-[#D4D1CB] text-[10px]`}
                        >
                            <div className="flex gap-1">

                            {/*
                                {user && <Image
                                    src={user.img}
                                    width={20}
                                    height={20}
                                    alt="pp"
                                    className="rounded-full"
                                />}
                                */}

                                {user?.username}
                            </div>
                        </div>
                    } 
                    {
                        user && <button
                            className={`text-[10px] text-red-500`}
                            onClick={() => {
                                deleteCookie('user'),
                                    router.push('/')
                            }}
                        >
                            Log Out
                        </button>
                    }
                </div>
                


            </div>
        </>
    )
}
