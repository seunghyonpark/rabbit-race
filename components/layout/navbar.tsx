'use client';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import API from '@/libs/enums/API_KEY';
import { deleteCookie, getCookie, hasCookie } from 'cookies-next';
import Coin from '@/libs/enums/coin.enum';
import { IUser } from '@/libs/interface/user';
import MobilNavbar from './mobilNavbar';
import { useRouter } from 'next/navigation';

export default function Navbar() {

    const router = useRouter();
    const [user, setUser] = useState<IUser>()

    const getUser = async () => {
        const inputs = {
            method: 'getOne',
            API_KEY: process.env.API_KEY,
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
    useEffect(() => {
        if (hasCookie("user") && !user) {
            setInterval(() => {
                getUser()
            }, 5 * 1000)
        }
    })

    return (
        <>
            {/* //? LG Screen üstü görüntü */}
            <div className="hidden lg:flex items-center justify-center w-full h-20 bg-[#24252F] sticky top-0 z-50 ">
                <div className="flex flex-col gap-3 items-center justify-center w-[250px] absolute top-0 bg-[#24252F] rounded-lg h-full z-50  ">
                    <Link href={"/"} className="hover:opacity-50">
                        <Image src={"/logo.png"} alt="" width={150} height={20} />
                    </Link>
                    <div className=" font-normal text-xs text-gray-200 tracking-widest">Change Your Life</div>
                </div>
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <div className="flex w-full bg-[#16181F] text-[11px] h-[30px] relative ">
                        <div className="marquee-container relative w-full">
                            <div className="marquee ">
                                <span>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet culpa voluptates quis incidunt officiis optio fugiat voluptatum enim aliquid reprehenderit, praesentium repudiandae cum velit quos dicta eum quasi suscipit consectetur.
                                </span>
                            </div>
                            <div className="marquee marquee2 ">
                                <span>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum perferendis eveniet inventore est velit ad modi ratione repellat doloremque dicta quod asperiores numquam dignissimos quo, reprehenderit ex rem nulla ipsam!
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center w-full h-[50px] bg-[#24252F] px-3 ">
                        <div className="flex items-center w-full gap-7 text-[#9293A6] fill-[#9293A6] uppercase ">
                            {user && <Link
                                href={"/hipodrom/deposit"}
                                className={`text-[13px] text-[#dca709]`}
                            >
                                Deposit / Withdraw
                            </Link>}
                        </div>
                        <div className="flex items-center w-full justify-end gap-4">
                            {user && <div
                                className={`flex items-center justify-center  bg-black rounded-md h-[36px] text-center px-5 text-[#BA8E09] border border-[#BA8E09] `}
                            >
                                {user?.deposit} <span className="text-[#9293A6]">{" "}{Coin.symbol}</span>
                            </div>
                            }
                            {
                                !user && <Link
                                    href={"/hipodrom/login"}
                                    className={`text-[13px] text-[#9293A6]  border-t-2 border-green-500 p-1`}
                                >
                                    Sign In
                                </Link>
                            }
                            {
                                !user && <Link
                                    href={"/hipodrom/register"}
                                    className={`text-[13px] text-[#9293A6]  border-t-2 border-yellow-500 p-1`}
                                >
                                    Sign Up
                                </Link>
                            }
                            {
                                user && <div
                                    // href={"/hipodrom/profile"}
                                    className={`flex items-center shadow-sm  justify-center rounded-md p-1 gap-2  h-[36px] px-2 text-[#D4D1CB] text-[13px]`}
                                >
                                    <div className="flex gap-1">
                                        {user && <Image
                                            src={user.img}
                                            width={20}
                                            height={20}
                                            alt="pp"
                                            className="rounded-full"
                                        />}
                                        {user?.username}
                                    </div>
                                </div>
                            }
                            {
                                user && <button
                                    className={`text-[13px] text-red-500`}
                                    onClick={() => {
                                        deleteCookie('user')
                                        getUser();
                                        router.push('/hipodrom')
                                    }}
                                >
                                    Log Out
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* //? Mobil Navbar */}
            <MobilNavbar />
        </>
    )
}


