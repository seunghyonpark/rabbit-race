import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
    return (
        <>
            <div className='flex flex-col w-full p-10 text-gray-500 gap-5'>
                <Link href="/hipodrom" className='w-full'>
                    <Image src="/logo.png" width="100" height="50" alt="logo" />
                </Link>
                <div className='w-full flex flex-col '>
                    <p>All Rights Reserved © 2023 John Doe </p>
                </div>
            </div>
        </>
    )
}
