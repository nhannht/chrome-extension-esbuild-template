import React from 'react'

export default function SettingIndex() {
    const [number, setNumber] = React.useState(0)

    return (
        <div
            className={'container  mx-auto flex flex-col place-content-center place-items-center place-self-center'}>
            <button type="button"
                    className={'bg-gray-500 hover:bg-black text-white font-bold py-2 px-4 rounded'}
                    onClick={() => setNumber(number + 1)}>Click me
            </button>
            <div className={'text-red-600'}>{number}</div>
        </div>
    )
}