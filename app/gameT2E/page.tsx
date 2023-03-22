'use client';
import BetInputs from '@/components/betScreen/betInputs'
import BetTables from '@/components/betScreen/betTables'
import Son20Oyun from '@/components/betScreen/son20';
import LatestWinners from '@/components/betScreen/latestWinners';
import YuruyenAt from '@/components/betEkrani/yuruyenAt'

import Race from '@/components/yarisEkrani/raceGame';

import SocketEnum from '@/libs/enums/socket';
import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

//@ts-ignore
import { io } from "socket.io-client";



// code for web3
import {
    useActiveClaimConditionForWallet,
    useAddress,
    useClaimConditions,
    useClaimedNFTSupply,
    useClaimerProofs,
    useClaimIneligibilityReasons,
    useContract,
    useContractMetadata,
    useUnclaimedNFTSupply,
    Web3Button,
  } from "@thirdweb-dev/react";
  import { BigNumber, utils } from "ethers";
  import { parseIneligibility } from "../../utils/parseIneligibility";
  
  
  // Put Your NFT Drop Contract address from the dashboard here
  //const myNftDropContractAddress = "0x90E2dD8C48cA35534Dd70e3eC19B362cdf71981E";
  
  const myNftDropContractAddress = "0x327dA22b2bCdfd6F4EE4269892bd39Fe6c637BcC";
  
  



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
    
    const [myBetAmount, setMyBetAmount] = useState<any>("");

    
    const MySwal = withReactContent(Swal);


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




    // code for web3

    const { contract: nftDrop } = useContract(myNftDropContractAddress);

    const address = useAddress();
    const [quantity, setQuantity] = useState(1);
  
    const { data: contractMetadata } = useContractMetadata(nftDrop);
  
    const claimConditions = useClaimConditions(nftDrop);
  
    const activeClaimCondition = useActiveClaimConditionForWallet(
      nftDrop,
      address || ""
    );
    const claimerProofs = useClaimerProofs(nftDrop, address || "");
    const claimIneligibilityReasons = useClaimIneligibilityReasons(nftDrop, {
      quantity,
      walletAddress: address || "",
    });
    const unclaimedSupply = useUnclaimedNFTSupply(nftDrop);
    const claimedSupply = useClaimedNFTSupply(nftDrop);
  
    const numberClaimed = useMemo(() => {
      return BigNumber.from(claimedSupply.data || 0).toString();
    }, [claimedSupply]);
  
    const numberTotal = useMemo(() => {
      return BigNumber.from(claimedSupply.data || 0)
        .add(BigNumber.from(unclaimedSupply.data || 0))
        .toString();
    }, [claimedSupply.data, unclaimedSupply.data]);
  
    const priceToMint = useMemo(() => {
      const bnPrice = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0
      );
      return `${utils.formatUnits(
        bnPrice.mul(quantity).toString(),
        activeClaimCondition.data?.currencyMetadata.decimals || 18
      )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
    }, [
      activeClaimCondition.data?.currencyMetadata.decimals,
      activeClaimCondition.data?.currencyMetadata.symbol,
      activeClaimCondition.data?.currencyMetadata.value,
      quantity,
    ]);
  
    const maxClaimable = useMemo(() => {
      let bnMaxClaimable;
      try {
        bnMaxClaimable = BigNumber.from(
          activeClaimCondition.data?.maxClaimableSupply || 0
        );
      } catch (e) {
        bnMaxClaimable = BigNumber.from(1_000_000);
      }
  
      let perTransactionClaimable;
      try {
        perTransactionClaimable = BigNumber.from(
          activeClaimCondition.data?.maxClaimablePerWallet || 0
        );
      } catch (e) {
        perTransactionClaimable = BigNumber.from(1_000_000);
      }
  
      if (perTransactionClaimable.lte(bnMaxClaimable)) {
        bnMaxClaimable = perTransactionClaimable;
      }
  
      const snapshotClaimable = claimerProofs.data?.maxClaimable;
  
      if (snapshotClaimable) {
        if (snapshotClaimable === "0") {
          // allowed unlimited for the snapshot
          bnMaxClaimable = BigNumber.from(1_000_000);
        } else {
          try {
            bnMaxClaimable = BigNumber.from(snapshotClaimable);
          } catch (e) {
            // fall back to default case
          }
        }
      }
  
      const maxAvailable = BigNumber.from(unclaimedSupply.data || 0);
  
      let max;
      if (maxAvailable.lt(bnMaxClaimable)) {
        max = maxAvailable;
      } else {
        max = bnMaxClaimable;
      }
  
      if (max.gte(1_000_000)) {
        return 1_000_000;
      }
      return max.toNumber();
    }, [
      claimerProofs.data?.maxClaimable,
      unclaimedSupply.data,
      activeClaimCondition.data?.maxClaimableSupply,
      activeClaimCondition.data?.maxClaimablePerWallet,
    ]);
  
    const isSoldOut = useMemo(() => {
      try {
        return (
          (activeClaimCondition.isSuccess &&
            BigNumber.from(activeClaimCondition.data?.availableSupply || 0).lte(
              0
            )) ||
          numberClaimed === numberTotal
        );
      } catch (e) {
        return false;
      }
    }, [
      activeClaimCondition.data?.availableSupply,
      activeClaimCondition.isSuccess,
      numberClaimed,
      numberTotal,
    ]);
  
    /////console.log("claimIneligibilityReasons", claimIneligibilityReasons.data);
  
    const canClaim = useMemo(() => {
      return (
        activeClaimCondition.isSuccess &&
        claimIneligibilityReasons.isSuccess &&
        claimIneligibilityReasons.data?.length === 0 &&
        !isSoldOut
      );
    }, [
      activeClaimCondition.isSuccess,
      claimIneligibilityReasons.data?.length,
      claimIneligibilityReasons.isSuccess,
      isSoldOut,
    ]);
  
    const isLoading = useMemo(() => {
      return (
        activeClaimCondition.isLoading ||
        unclaimedSupply.isLoading ||
        claimedSupply.isLoading ||
        !nftDrop
      );
    }, [
      activeClaimCondition.isLoading,
      nftDrop,
      claimedSupply.isLoading,
      unclaimedSupply.isLoading,
    ]);
  
    const buttonLoading = useMemo(
      () => isLoading || claimIneligibilityReasons.isLoading,
      [claimIneligibilityReasons.isLoading, isLoading]
    );
  
    const buttonText = useMemo(() => {
      if (isSoldOut) {
        return "Sold Out";
      }
      
      if (canClaim) {
        const pricePerToken = BigNumber.from(
          activeClaimCondition.data?.currencyMetadata.value || 0
        );
        if (pricePerToken.eq(0)) {
          return "Bet (Free)";
        }
        return `Bet (${priceToMint})`;
      }
      if (claimIneligibilityReasons.data?.length) {
        return parseIneligibility(claimIneligibilityReasons.data, quantity);
      }
      if (buttonLoading) {
        return "Checking eligibility...";
      }
  
      return "Claiming not available";
    }, [
      isSoldOut,
      canClaim,
      claimIneligibilityReasons.data,
      buttonLoading,
      activeClaimCondition.data?.currencyMetadata.value,
      priceToMint,
      quantity,
    ]);
  
  
  





    
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
                                   <span className="text-[#ffffff]">ENTRY PRICE (ETH):</span>&nbsp;&nbsp;&nbsp;
                                   <span>{currentPrice}&nbsp;&nbsp;&nbsp;</span>
                                   <span className="text-[#ffffff]">USDT</span>
                                </div>


                            </div>

                        </div>


                        <BetInputs 
                            horse1={horse1Oran}
                            horse2={horse2Oran}
                            setLongShort={setlongShort}
                            setMyBetAmount={setMyBetAmount}

                        />

                        {/*
                        <BetTables />
                            */}

                    </div>
                )
                :
                < Race
                  betPrice={basePrice}
                  betLongShort={longShort}
                  betAmount={myBetAmount}
                />
            }
        </>
    )
}
