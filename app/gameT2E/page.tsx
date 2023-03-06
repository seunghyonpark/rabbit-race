'use client';
import BetInputs from '@/components/betScreen/betInputs'
import BetTables from '@/components/betScreen/betTables'
import Son20Oyun from '@/components/betScreen/son20';
import SonKazananlar from '@/components/betScreen/sonKazananlar';
import YuruyenAt from '@/components/betEkrani/yuruyenAt'
import Race from '@/components/yarisEkrani/yaris'
import SocketEnum from '@/libs/enums/socket';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';


//@ts-ignore
import { io } from "socket.io-client";

// Bebas Neue
//////let socket;

export default function GameT2E() {
    const [status, setStatus] = useState<any>();
    const [time, setTime] = useState<any>(0);
    const [horse1Oran, setHorse1Oran] = useState<any>([]);
    const [horse2Oran, setHorse2Oran] = useState<any>([]);


    useEffect(() => socketInitializer(), []);

    const socketInitializer = () => {
        const socket = io(`${SocketEnum.id}`, {
            transports: ["websocket"],
        });
        socket.on("connect", () => {
        })
        socket.on('status', (data: any) => { setStatus(data) })
        socket.on('time', (data: any) => { setTime(data) })
        socket.on('horse1Orana', (data: any) => { setHorse1Oran(data) })
        socket.on('horse2Orana', (data: any) => { setHorse2Oran(data) })

    }

    
    return (
        <>
            {!status ?
                (
                    <div className='flex flex-col px-10 pb-10 w-full h-full items-center justify-center gap-5 bg-[#0C0E1A] relative'>
                        <SonKazananlar />
                        <Son20Oyun />
                        <div className="bg-center bg-no-repeat bg-contain bg-[url(/back.svg)] h-full ">
                            <div className="flex flex-col items-center justify-center md:gap-14 md:py-10 bg-gradient-radial from-transparent via-[#0C0E1A] to-transparent bg-blend-difference h-full md:px-32">
                                {/*
                                <YuruyenAt time={time} horseSrc={'/at.json'} />
                                */}

                                <Image src="/gameT2E.png" width={500} height={500} alt="gameT2E" />


                            </div>
                        </div>
                        <BetInputs 
                        horse1={horse1Oran}
                        horse2={horse2Oran}
                        />
                        <BetTables />
                    </div>
                )
                :
                < Race />
            }
        </>
    )
}
