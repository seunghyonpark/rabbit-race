"use client";
import API from '@/libs/enums/API_KEY'
import Coin from '@/libs/enums/coin.enum';
import { IUser } from '@/libs/interface/user'
import { hasCookie, getCookie, deleteCookie } from 'cookies-next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function MobilNavbar() {
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
        getUser()
    })


    return (
        <>
            <div className="lg:hidden w-full flex items-center gap-2 px-5 h-20 bg-[#24252F]">
                <Link href={"/"}>
                    <Image src={"/logo.png"} width={100} height={100} alt="logo" />
                </Link>
                <div className='w-full p-2 flex items-center justify-end gap-3'>
                    {user && <Link
                        href={"/hipodrom/deposit"}
                        className={`text-[13px] text-[#dca709]`}
                    >
                        Deposit / Withdraw
                    </Link>}
                    {user && <div
                        className={`flex items-center justify-center  bg-black rounded-md h-[36px] text-center px-5 text-[#BA8E09] border border-[#BA8E09] `}
                    >
                        {`${user.deposit.toString().slice(0, 3)}...`} <span className="text-[#9293A6]">{" "}{Coin.symbol}</span>
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
                    {/* {
                        user && <Link
                            href={"/hipodrom/profile"}
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
                        </Link>
                    } */}
                    {
                        user && <button
                            className={`text-[13px] text-red-500`}
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
