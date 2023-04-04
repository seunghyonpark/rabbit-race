"use client";
import API from '@/libs/enums/API_KEY'
import Coin from '@/libs/enums/coin.enum';
import { IUser } from '@/libs/interface/user'
import { hasCookie, getCookie, deleteCookie } from 'cookies-next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';
import Button from "@mui/material/Button";


////import Wallet from "../../components/Wallet";
////import { useListen } from "../../hooks/useListen";
////import { useMetamask } from "../../hooks/useMetamask";

import Sidebar from "./Sidebar";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import Modal from '../../components/Modal';

import MyPage from '../MyPage';




/*
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Web3 from "web3";
import abi from "../../public/abi.json";
import { Stack, Snackbar, Alert } from "@mui/material";
import DomainEnum from "@/libs/enums/domain";
*/




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


const MySwal = withReactContent(Swal);







export default function MobilNavbar({user} : {user: any}) {

  ////console.log("MobilNavbar user", user);
 
  /*
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

*/



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


    const [wallet, setWallet] = useState<any>(null);

    const router = useRouter();

    const [game, setGame] = useState<any>();


    /*
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
            const userInfo = await res.json()
            setUser(userInfo.user.user)
            //setWallet("0x22571950F07e5acb92160E133B3878267c86aF56")
            setWallet(userInfo.user.user.nftWalletAddress)
        }
    }
    */

    /*
    const getGame = async () => {

      console.log("getGame user", user);
      console.log("getGame username", username);

      const res = await fetch('/api/game', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({
              method: "getGameByUsername",
              API_KEY: process.env.API_KEY,
              username: user?.username,
          })
      })
      const data = await res.json()

      console.log("game==============", data.game);


      setGame(data.game)
    }
    */

    /*
    useEffect(() => {
      if (hasCookie("user") && !user) {
          setInterval(() => {

              /////getUser();



              setUsername(user?.username)

              getGame();

          }, 5 * 1000)
      }
    })
    */

    useEffect(() => {


      const getGame = async () => {

     
        const res = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
            body: JSON.stringify({
                method: "getGameByUsername",
                API_KEY: process.env.API_KEY,
                username: user?.username,
            })
        })
        const data = await res.json()
  
       
        setGame(data.game)
      }


      if (hasCookie("user") && user) {
              getGame();
      }

      setWallet(user?.nftWalletAddress);

    
    }, [user]);

    /*
    useEffect(() => {
        getUser();
    });
    */

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

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="lg:hidden w-full flex items-center gap-2 px-2 h-20 bg-[#24252F]">

           


                <Link href={"/"}>
                    <Image src={"/logo.png"} width={100} height={100} alt="logo" />
                </Link>




 

                
                <div className='w-full p-2 flex items-center justify-end gap-3'>


                  

                  {user && game?.selectedSide === "Long" &&
                    <Image
                      src={'/rabbit1.gif'}
                      width={30}
                      height={30}
                      alt="game"
                      className="rounded-md"
                      onClick={() => {
                        router.push('/gameT2E')
                      }}
                    />
                  }

                  {user && game?.selectedSide === "Short" &&
                    <Image
                      src={'/rabbit2.gif'}
                      width={30}
                      height={30}
                      alt="game"
                      className="rounded-md"
                      onClick={() => {
                        router.push('/gameT2E')
                      }}
                    />
                  }

                  {user && !game &&
                    <Image
                      src={user?.img}
                      width={25}
                      height={25}
                      alt="pfp"
                      className="rounded-md"
                      onClick={() => {
                        router.push('/gameT2E')
                      }}
                    />
                  }

                  



                    {/*
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
                      */}



                    {
                        user && <div
                            className={`flex items-center justify-center  bg-black rounded-md h-[32px] text-[13px] text-center px-5 text-[#BA8E09] border border-[#BA8E09] `}
                        >

          

                        <Link
                            href={"/gameT2E/deposit"}
                            className={"pr-3 "}
                        >
                            <Image src={"/wallet-icon-white.png"} width={10} height={40} alt="logo" />
                        </Link>


                          {/*
                            {`${user.deposit.toString().slice(0, 3)}...`}&nbsp;&nbsp;<span className="text-[#9293A6]">{" "}{Coin.symbol}</span>
                    */}


                            {`${Number(user?.deposit).toFixed(0)}`}&nbsp;&nbsp;<span className="text-[#9293A6]">{" "}{Coin.symbol}</span>
                        </div>
                    }



                    {!user && <Link
                            href={"/gameT2E/login"}
                            className={`text-[12px] text-[#9293A6]  border-t-2 border-green-500 p-1`}
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
                            
                            className={`flex items-center shadow-xl  justify-center rounded-md p-1 gap-2  h-[36px] px-2 text-[#D4D1CB] text-[12px]`}
                            onClick={() => setShowModal(!showModal)}
                        >
                          {user?.username}

                        </div>
                    } 



                    
                    {/*
                        user && <button
                            className={`text-[10px] text-red-500`}
                            onClick={() => {
                                deleteCookie('user');
                                getUser();
                                router.push('/gameT2E');
                            }}
                        >
                            Log Out
                        </button>
                          */}

              
                </div>
                


            </div>



            <Modal
              
              show={showModal}
              onClose={() => setShowModal(false)}
                
            >

            <div className="w-full flex flex-row items-center justify-left gap-1 bg-red-900 ">

              {wallet !== "0x" && 

                  <div
                    className="w-full text-white text-center justify-left pl-3 p-2 items-left bg-red-900 hover:bg-[#141111] flex flex-row"
                    onClick={() => {
                      setShowModal(false), router.push('/gameT2E/mynft')
                  }}
                  >
                      <Image
                        src={"/metamask-fox.svg"}
                        alt="meta-svg"
                        width={20}
                        height={20}
                      />
                    <h2 className="pl-3 text-left text-xs">
                          <span className="text-[#f5841f]">Connected with</span>
                          <p className="text-sm text-white">{wallet?.slice(0, 5)}...{wallet?.slice(wallet.length - 5, wallet?.length)}</p>
                    </h2>

                  </div>
              }
              {wallet === "0x" && 
          
                    <div
                      className="w-full text-white text-center justify-center p-5 items-center bg-red-900 hover:bg-[#141111] flex flex-row"
                      onClick={() => {
                        setShowModal(false), router.push('/gameT2E/mynft')
                      }}
                      >
                        <Image
                            src={"/metamask-fox.svg"}
                            alt="meta-svg"
                            width={20}
                            height={20}
                        />
                        <h2 className="text-sm pl-3">
                            <span className="text-[#f5841f]">METAMASK</span> CONNECT
                        </h2>
                    </div>
           
              }

            </div>


            <div className='flex flex-col pl-5 pr-3 mt-3 text-gray-200 '>


              <div className="w-full rounded-lg flex flex-col items-center justify-center pt-2 gap-1">                                    
                  
                  <div className="w-full rounded-lg flex flex-row items-center justify-left  gap-1 ">

                    {user && <Image
                        src={user?.img}
                        width={90}
                        height={90}
                        alt="pfp"
                        className="rounded-md"
                    />}

                    <div className="w-full rounded-lg flex flex-col items-center justify-left p-2 gap-1 ">
                      <div className='text-xs'>Equity Value (CRA)</div>

                      <div className='text-xl font-extrabold'>
                        {`${Number(user?.deposit).toFixed(0)}`}
                      </div>

                      {user &&
                      <button
                          className={`text-[10px] text-red-500`}
                          onClick={() => {
                            setShowModal(false);
                            deleteCookie('user');
                            //////getUser();
                            router.push('/gameT2E');
                          }}
                      >
                          Log Out
                      </button>
                      }
                    </div>
                                                        
                  </div>


                  <div
                    className={` w-full pt-3 items-left text-xl text-white`}
                    onClick={() => {
                        setShowModal(false), router.push('/gameT2E/depositRequests')
                    }}
                    >
                      Deposit
                  </div>

                  <div
                    className={`w-full pt-1 items-left text-xl text-white `}
                    onClick={() => {
                        setShowModal(false), router.push('/gameT2E/withdrawRequests')
                    }}
                    >
                      Withdrawal
                  </div>

                  <div
                    className={`w-full pt-1 items-left text-xl text-white `}
                    onClick={() => {
                        setShowModal(false), router.push('/gameT2E/betHistory')
                    }}
                    >
                      Bet History
                  </div>

                  <div
                    className={` disabled pt-1 w-full items-left text-xl text-white `}
                    onClick={() => {
                        setShowModal(false), router.push('/gameT2E')
                    }}
                    >
                      Game Ranking
                  </div>

{/*
                  <button
                    className={` btn btn-success w-full`}
                    onClick={() => {
                      
                        ///setShowModal(false), deleteCookie('user'), router.push('/gameT2E')
                    }}
                    >
                        How to Bet in T2E Game?
                  </button>
                  */}

              </div>


            </div>
        


            </Modal>
            
            
        </>
    )
}
