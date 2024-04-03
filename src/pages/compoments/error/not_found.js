import { Link, useSearchParams } from "react-router-dom"
import Navbar from "../../compoments/navbar";
import { useEffect } from "react";

const NotFound = () => {
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
        <div className="flex z-10 flex-col  self-center px-20 py-16 mt-0 max-w-full text-left bg-white rounded shadow-lg text-neutral-800 w-[800px] max-md:px-5 relative top-[-50px]">
            <p className="text-xl leading-10">
                404 | Not Found
            </p>
            {/* <div className="mt-5 text-lg font-semibold leading-9">
            Your Ticket Was Completed Successfully.
            </div> */}
            <p className="text-4xl font-bold text-slate-900 leading-10 mb-5">
            SORRY, THE PAGE NOT FOUND
            </p>

            <p>The link you followed probably broken or the page has been removed.</p>

            <Link to={'/'} className="border py-2 px-5 mt-5 border-solid rounded font-semibold w-fit">
            <span >
                HOME
            </span>
            </Link>
        </div>
        
        
        </div>

        </>
    )
} 

export default NotFound;