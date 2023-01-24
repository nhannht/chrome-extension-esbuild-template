import React from 'react';
// import logo512 from logo512.png;

export default function DefaultIndex() {
    const [number, setNumber] = React.useState(0);
    return (
        <div className={"container w-full mx-auto p-4"}>
            <div
                className={"container p-4 flex flex-col place-content-center place-items-center" +
                    "place-self-center text-center"}>
                <div className={"text-xl font-bold "}>This is default view</div>
                <button type="button"
                        className={"bg-gray-700 hover:bg-black text-white font-bold py-2 px-4 rounded"}
                        onClick={() => setNumber(number + 1)}
                >{number}</button>
            </div>
        </div>
    );
}