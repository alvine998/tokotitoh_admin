import React, { ButtonHTMLAttributes } from 'react'


type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: any,
    color?: 'primary' | 'danger' | 'info' | 'warning' | 'white',
    className?: any;
}

export default function Button(props: Props) {
    const {
        children,
        color = 'primary',
        className
    } = props
    return (
        <div className='my-2 w-full'>
            {
                color == 'primary' &&
                <button {...props} className={'w-full p-1 bg-green-700 hover:bg-green-500 duration-150 transition-all rounded-md text-white ' + className}>
                    {children}
                </button>
            }
            {
                color == 'danger' &&
                <button {...props} className={'w-full p-1 bg-red-700 hover:bg-red-500 duration-150 transition-all rounded-md text-white ' + className}>
                    {children}
                </button>
            }
            {
                color == 'warning' &&
                <button {...props} className={'w-full p-1 bg-yellow-700 hover:bg-yrllow-500 duration-150 transition-all rounded-md text-black ' + className}>
                    {children}
                </button>
            }
            {
                color == 'info' &&
                <button {...props} className={'w-full p-1 bg-blue-700 hover:bg-blue-500 duration-150 transition-all rounded-md text-white ' + className}>
                    {children}
                </button>
            }
            {
                color == 'white' &&
                <button {...props} className={'w-full p-1 bg-white duration-150 transition-all rounded-md text-black ' + className}>
                    {children}
                </button>
            }
        </div>
    )
}