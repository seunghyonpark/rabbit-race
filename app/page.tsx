import { Inter } from '@next/font/google'
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import YuruyenAt from '@/components/betEkrani/yuruyenAt';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  return (
    <main className={inter.className}>
      <div className="bg-[#0C0E1A] text-lg">
        <div className="w-full h-full flex flex-col ">
          <div className="flex">
            <div className="flex flex-col w-full min-h-screen h-full">
              <div className='w-full h-5 lg:h-16'></div>
              <div style={{ minHeight: "calc(100vh - 12rem)" }}>
                <div className="bg-center bg-no-repeat bg-contain bg-[url(/back.svg)] h-full">
                  <div className="flex flex-col items-center justify-center gap-14 lg:py-10 bg-gradient-radial from-transparent via-[#0C0E1A] to-transparent bg-blend-difference h-full">
                    <h1 className='text-white text-center w-full text-lg font-bebasNeue md:text-3xl'>Crypto Game Place Horse Race</h1>
                    <YuruyenAt time={null} horseSrc={'/at.json'} />
                    <Link href={"/hipodrom"} className="w-64 h-16 bg-gradient-to-r from-[#08FF08] to-[#008013] rounded-lg flex items-center justify-center">
                      <span className="text-gray-200 text-2xl ">Go To Hipodrom</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

