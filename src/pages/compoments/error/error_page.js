import { Link, useSearchParams } from "react-router-dom"
import Navbar from "../../compoments/navbar";
import { useEffect } from "react";

const ErrorPage = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if(localStorage.getItem(searchParams.get('order'))){
            localStorage.removeItem(searchParams.get('order'));
       }
    }, [searchParams])
    
    return (
        <>
        
        <div className="flex flex-col bg-white">
            <Navbar/>
        <div className="flex flex-col items-center px-16 pt-12 pb-20 w-full text-6xl font-black text-center text-white uppercase whitespace-nowrap leading-[78px] max-md:px-5 max-md:max-w-full max-md:text-4xl bg-black">
            <div className="flex flex-col mb-2.5 max-w-full w-[294px] max-md:text-4xl">
            <img alt="asset-logo"
                loading="lazy"
                src="/images/icon/logo.svg"
                className="self-center max-w-full aspect-[5.56] w-[200px]"
            />
            {/* <div className="mt-10 max-md:mt-10 max-md:text-4xl">Success!</div> */}
            </div>
        </div>
        <div className="flex z-10 flex-col items-center self-center px-20 py-16 mt-0 max-w-full text-center bg-white rounded shadow-lg text-neutral-800 w-[800px] max-md:px-5 relative top-[-50px]">
            <div className="text-3xl font-black leading-10">Maaf Sedang Terjadi Kendala !!</div>
            {/* <div className="mt-5 text-lg font-semibold leading-9">
            Your Ticket Was Completed Successfully.
            </div> */}
            <div className="self-stretch mt-2 text-base leading-6 text-neutral-800 max-md:max-w-full">
            Saat ini server sedang dalam perbaikan, mohon hubungi customer service.
            </div>
        </div>
        <button className="justify-center self-center px-10 py-2 my-5 text-sm font-semibold tracking-wider leading-5 text-center text-white uppercase bg-amber-400 rounded-3xl max-md:px-5 max-md:mt-10">
            <Link to={'/'}>Cari Tiket</Link>
        </button>
        
        </div>

        </>
    )
} 

export default ErrorPage;