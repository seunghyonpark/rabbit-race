'use client';
import BetInputs from '@/components/betScreen/betInputs'
import BetTables from '@/components/betScreen/betTables'
import Son20Oyun from '@/components/betScreen/son20';
import LatestWinners from '@/components/betScreen/latestWinners';
import YuruyenAt from '@/components/betEkrani/yuruyenAt'
import Race from '@/components/yarisEkrani/yarisNew';
import SocketEnum from '@/libs/enums/socket';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';


//@ts-ignore
import { io } from "socket.io-client";

// Bebas Neue
let socket;

export default function GameT2E() {
    const [status, setStatus] = useState<any>();
    const [time, setTime] = useState<any>(0);
    const [horse1Oran, setHorse1Oran] = useState<any>([]);
    const [horse2Oran, setHorse2Oran] = useState<any>([]);

    const [currentPrice, setCurrentPrice] = useState<any>(1682.32);

    const [basePrice, setBasePrice] = useState<any>(1682.32);
    const [longShort, setlongShort] = useState<any>("Long");
    
    const [betAmount, setBetAmount] = useState<any>("");



    useEffect(() => socketInitializer(), []);


    setTimeout(() => {

        const price = 1682.32 + Math.random()*10;
        setCurrentPrice(price.toFixed(2));

    }, 400);


    const socketInitializer = () => {

        const socket = io(`${SocketEnum.id}`, {
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log("GameT2E socketInitializer connect");
        });

        socket.on('status', (data: any) => {
            console.log("GameT2E socketInitializer status", data);
            setStatus(data);

            if (data === true) {
                setBasePrice(currentPrice);
            } 

            //setStatus(true);
        });

        socket.on('time', (data: any) => {
            console.log("GameT2E socketInitializer time", data);
            setTime(data)
        });

        socket.on('horse1Orana', (data: any) => {
            console.log("GameT2E socketInitializer horse1Orana", data);
            setHorse1Oran(data)
        });

        socket.on('horse2Orana', (data: any) => {
            console.log("GameT2E socketInitializer horse2Orana", data);
            setHorse2Oran(data)
        });


    }

    
    return (
        <>
            {!status ?
                (
                    <div className='flex flex-col px-10 pb-10 w-full h-full items-center justify-center gap-5 bg-[#0C0E1A] relative'>
                        
                        
                        <LatestWinners />
                

                        
                        <Son20Oyun />
                

                        <div className="bg-center bg-no-repeat bg-contain bg-[url(/back.svg)] h-full">
                            <div className="flex flex-col items-center justify-center md:gap-14 md:py-10 bg-gradient-radial from-transparent via-[#0C0E1A] to-transparent bg-blend-difference h-full md:px-32 mt-5">
                                {/*
                                <YuruyenAt time={time} horseSrc={'/at.json'} />
                                */}

                                <Image src="/realtime-ticking-stock-chart.gif" width={500} height={500} alt="gameT2E" />


                                <div
                                    className={`flex items-center justify-center text-xl  bg-black rounded-md h-[36px] text-center px-5 text-[#BA8E09] border border-[#BA8E09] mt-5`}
                                >
                                   <span>ETH/USDT:</span>&nbsp;&nbsp;&nbsp; <span className="text-[#ffffff]">{currentPrice}</span>
                                </div>


                            </div>

                        </div>


                        <BetInputs 
                            horse1={horse1Oran}
                            horse2={horse2Oran}

                        />

                        {/*
                        <BetTables />
                            */}

                    </div>
                )
                :
                < Race betPrice={basePrice} betLongShort={longShort} betAmount={betAmount}/>
            }
        </>
    )
}
