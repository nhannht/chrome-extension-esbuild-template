import React from 'react'

export default function SettingIndex() {
    const [number, setNumber] = React.useState(0)

    return (
        <div className={'container w-full mx-auto flex flex-col'}>
            <button
                className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'}
                onClick={() => setNumber(number + 1)}>Click me
            </button>
            <div className={'text-2xl font-bold'}>This is setting view header</div>
            <div className={'font-bold'}>This is setting view header</div>
            <div className={'text-red-600'}>{number}</div>
        </div>
    )
}