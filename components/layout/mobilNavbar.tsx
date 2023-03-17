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






import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Web3 from "web3";
import abi from "../../public/abi.json";
import { Stack, Snackbar, Alert } from "@mui/material";
import DomainEnum from "@/libs/enums/domain";




export default function MobilNavbar() {


    /*
    const { dispatch } = useMetamask();
    const listen = useListen();


    let Abifile: any = abi;
    let contractAddress = "0x46aA314E5ee3c0E5E945B238075d2B5eB2AAA317";
    const MySwal = withReactContent(Swal);
    const [errMsg, setErrMsg] = useState<String>();
    const [metamusk, setMetaMask] = useState<boolean>(false);
    const [wallet, setWallet] = useState<any>(null);
    const [networkName, setNetworkName] = useState<any>(null);
    const [network, setNetwork] = useState<any>(false);
    const [contract, setContract] = useState<any>();
    const [depositCount, setDepositCount] = useState<any>(0);
    const [metamaskview, setMetamaskView] = useState<boolean>(false);

    const [succ, setSucc] = React.useState(false);
    const [err, setErr] = React.useState(false);
    const [errMsgSnackbar, setErrMsgSnackbar] = useState<String>("");
    const [successMsgSnackbar, setSuccessMsgSnackbar] = useState<String>("");
    const [waiting, setWaiting] = useState<boolean>(false);

    const [settings, setSettings] = useState<any>()
    */




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


    /*
    useEffect(() => {

        if (typeof window !== undefined) {
          // start by checking if window.ethereum is present, indicating a wallet extension
          const ethereumProviderInjected = typeof window.ethereum !== "undefined";
          // this could be other wallets so we can verify if we are dealing with metamask
          // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
          const isMetamaskInstalled = ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
    
          const local = window.localStorage.getItem("metamaskState");
    
          // user was previously connected, start listening to MM
          if (local) {
            listen();
          }
    
          // local could be null if not present in LocalStorage
          const { wallet, balance } = local
            ? JSON.parse(local)
            : // backup if local storage is empty
              { wallet: null, balance: null };
    
          ///////////dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance });
        }

      }, [listen]);
      

      useEffect(() => {
        setMetaMask(isMetaMaskInstalled());
        checkAccount();
        const { ethereum }: any = window;
        if (metamusk == true) {
          ethereum.on("networkChanged", function (networkId: any) {
            if (networkId == 97) {
              setNetwork(true);
            } else {
              setNetwork(false);
            }
          });
    
          ethereum.on("accountsChanged", function (accounts: any) {
            if (accounts.length !== 0) {
              setWallet(accounts[0]);
            } else {
              setWallet(null);
            }
          });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
      //? METAMASK
      const isMetaMaskInstalled = () => {
        const { ethereum }: any = window;
        return Boolean(ethereum && ethereum.isMetaMask);
      };
    
      const connectWallet = async () => {
        try {
          const { ethereum }: any = window;
          if (!ethereum) {
            return;
          }
          let chainId = await ethereum.request({ method: "eth_chainId" });
          const ethChainId = "0x13881";
          if (chainId !== ethChainId) {
            MySwal.fire({
              title: "Opsss?",
              text: "You are connected to the wrong network!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Change",
              cancelButtonText: "Cancel",
            }).then(async (result: any) => {
              if (result.isConfirmed) {
                try {
                  await ethereum
                    .request({
                      method: "wallet_switchEthereumChain",
                      params: [{ chainId: "0x13881" }],
                    })
                    .then(() => {
                      if (ethereum) {
                        ethereum.on("chainChanged", async (chainId: any) => {
                          if ((chainId = "0x13881")) {
                            const accounts = await ethereum.request({
                              method: "eth_requestAccounts",
                            });
                            setWallet(accounts[0]);
                            setNetwork(true);
                            setNetworkName("BSC Testnet");
                          }
                        });
                      }
                    });
                } catch (error: any) {
                  if (error.code === 4902) {
                    await ethereum
                      .request({
                        method: "wallet_addEthereumChain",
                        params: [
                          {
                            chainId: "0x13881",
                            chainName: "Mumbai Testnet",
                            nativeCurrency: {
                              name: "Mumbai Testnet",
                              symbol: "MATIC", // 2-6 characters long
                              decimals: 18,
                            },
                            blockExplorerUrls: ["https://polygonscan.com/"],
                            rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
                          },
                        ],
                      })
                      .then(() => {
                        if (ethereum) {
                          ethereum.on("chainChanged", async (chainId: any) => {
                            if ((chainId = "0x13881")) {
                              const accounts = await ethereum.request({
                                method: "eth_requestAccounts",
                              });
                              setWallet(accounts[0]);
                              setNetwork(true);
                              setNetworkName("BSC Testnet");
                            }
                          });
                        }
                      });
                  }
                }
              }
            });
          } else {
            const accounts = await ethereum.request({
              method: "eth_requestAccounts",
            });
            setWallet(accounts[0]);
            setNetwork(true);
            setNetworkName("BSC Testnet");
          }
        } catch (error) { }
      };
    
      async function wrongWallet() {
        try {
          const { ethereum }: any = window;
          let chainId = await ethereum.request({ method: "eth_chainId" });
          if (chainId !== "0x13881") {
            setNetwork(false);
          } else {
            setNetwork(true);
          }
        } catch (e: any) { }
      }
    
      useEffect(() => {
        if (isMetaMaskInstalled()) {
          wrongWallet();
          connectWallet();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
      async function checkAccount() {
        const { ethereum }: any = window;
        if (metamusk == true) {
          const accounts = await ethereum.request({ method: "eth_accounts" });
          if (accounts.length !== 0) {
            setWallet(accounts[0]);
          } else {
            setWallet(null);
            //await connectWallet()
          }
        }
      }
    
      useEffect(() => {
        if (wallet) {
          //@ts-ignore
           //@ts-ignore
          const web3 = new Web3(window.ethereum);
          const contract = new web3.eth.Contract(Abifile, contractAddress); //@ts-ignore
          setContract(contract);
        }
      }, [Abifile, contractAddress, wallet]);



      const paraYatir = async () => {

        console.log("paraYatir");


        if (depositCount == 0) {
          setErrMsgSnackbar("Please enter a value greater than 0");
          setErr(true);
          return
        } else if (depositCount < 0) {
          setErrMsgSnackbar("Please enter a value greater than 0");
          setErr(true);
          return
        }
        setMetamaskView(true);
        const maticCount = depositCount;
        contract.methods
          .deposit()
          .send({
            from: wallet,
            value: Web3.utils.toWei(depositCount, "ether"),
            gasLimit: 1000000,
          })
          .on("transactionHash", (hash: any) => {
          })
          .on("receipt", (receipt: any) => {
          })
          .on("confirmation", (confirmationNumber: any, receip: any) => {
            if (confirmationNumber == 1) {
              fetch("/api/deposit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  method: "makeMaticDeposit",
                  API_KEY: process.env.API_KEY,
                  userToken: getCookie("user"),
                  amount: parseFloat(maticCount),
                }),
              }).then((res) => res.json())
                .then(data => {
                  if (data.message == "Success") {
                    setMetamaskView(false);
                    getUser();
                    setSucc(true);
                    setSuccessMsgSnackbar("Transaction successful");
                  } else {
                    setMetamaskView(false);
                    setErrMsgSnackbar("Transaction failed");
                    setErr(true);
                  }
                })
            }
          })
          .on("error", (error: any) => {
            console.error(error);
            setMetamaskView(false);
            setErrMsgSnackbar("Transaction failed");
            setErr(true);
          });
    
      };

      */



    return (
        <>
            <div className="lg:hidden w-full flex items-center gap-2 px-2 h-20 bg-[#24252F]">



                <Link href={"/"}>
                    <Image src={"/logo.png"} width={80} height={100} alt="logo" />
                </Link>

                
                <div className='w-full p-2 flex items-center justify-end gap-3'>

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


                            ///////////paraYatir();



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
