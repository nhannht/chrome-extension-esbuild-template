import React from 'react';

export default function DefaultIndex() {
    const [number, setNumber] = React.useState(0);
    return (
        <div className={"container w-full mx-auto p-4"}>
            <div
                className={"container p-4 flex flex-col justify-center items-center place-content-center place-items-center" +
                    " place-self-center text-center"}>
                <div className={"text-xl font-bold"}>This is default view</div>
                <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
                        onClick={() => setNumber(number + 1)}
                >{number}</button>
            </div>
        </div>
    );
}