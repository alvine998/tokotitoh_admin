import React, { ButtonHTMLAttributes } from 'react'


type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: any,
    color?: 'primary' | 'danger' | 'info' | 'warning' | 'white',
    size?: 'full' | 'auto',
    className?: any;
}

export default function Button(props: Props) {
    const {
        children,
        color = 'primary',
        size = 'full',
        className
    } = props
    const widthClass = size === 'full' ? 'w-full' : 'w-auto'
    return (
        <div className={`my-2 ${size === 'full' ? 'w-full' : ''}`}>
            {
                color == 'primary' &&
                <button {...props} className={`${widthClass} p-1 bg-[#1e3a5f] hover:bg-[#2a4a73] duration-150 transition-all rounded-md text-white ` + className}>
                    {children}
                </button>
            }
            {
                color == 'danger' &&
                <button {...props} className={`${widthClass} p-1 bg-red-700 hover:bg-red-500 duration-150 transition-all rounded-md text-white ` + className}>
                    {children}
                </button>
            }
            {
                color == 'warning' &&
                <button {...props} className={`${widthClass} p-1 bg-orange-600 hover:bg-orange-500 duration-150 transition-all rounded-md text-white ` + className}>
                    {children}
                </button>
            }
            {
                color == 'info' &&
                <button {...props} className={`${widthClass} p-1 bg-blue-700 hover:bg-blue-500 duration-150 transition-all rounded-md text-white ` + className}>
                    {children}
                </button>
            }
            {
                color == 'white' &&
                <button {...props} className={`${widthClass} p-1 bg-white duration-150 transition-all rounded-md text-black border border-gray-300 px-2 ` + className}>
                    {children}
                </button>
            }
        </div>
    )
}