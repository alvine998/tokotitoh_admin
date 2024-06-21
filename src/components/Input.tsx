import { EyeIcon, EyeOffIcon } from 'lucide-react'
import React, { InputHTMLAttributes, useState } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string,
    isPassword?: boolean
}

export default function Input(props: Props) {
    const { label, isPassword } = props
    const [show, setShow] = useState<boolean>(false)
    return (
        <div className='my-2 flex flex-col w-full'>
            {
                label &&
                <label htmlFor={label} className='text-gray-500'>{label}</label>
            }
            {
                isPassword ?
                    <div className="flex flex-row w-full rounded-md border-0 py-1.5 pl-4 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400">
                        <input id={label} {...props} className='w-full sm:text-sm sm:leading-6 focus:outline-none' type={show ? "text" : 'password'} />
                        <button type='button' onClick={() => { setShow(!show) }} className='text-gray-500'>
                            {
                                show ?
                                    <EyeIcon /> :
                                    <EyeOffIcon />
                            }
                        </button>
                    </div> :
                    <input id={label} {...props}
                        className="block w-full rounded-md border-0 py-1.5 pl-4 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:outline-none sm:text-sm sm:leading-6"
                    />
            }
        </div>
    )
}