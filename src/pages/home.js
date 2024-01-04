import { useEffect, useState } from "react";
import CallApi from '../helper/Api';
import { Link } from "react-router-dom";
import Navbar from "./compoments/navbar";
import { useDispatch, useSelector } from "react-redux";
const HomePage = () => {

    const [event, setEvent ] = useState([]);
    const [category, setCategory] = useState([]);
    const [isLoading, setLoading] = useState(true);
    
    useEffect(() => {
        CallApi('event-dashboard', 'GET')
        .then(ress => {
            if(ress.success === true) {
                setEvent(ress.results.testing && ress.results.testing.length > 0 ?  ress.results.testing : ress.results.event);
                setCategory(ress.results.categories);
                setLoading(false);
                console.log(ress);
            }
            else {
                console.log(ress);
            }
        })

    }, [])

    const HomeContainer = () => {
        return (
            <div className="container mx-auto">
                <Navbar/>
                <div className="">
                    <Carousel/>

                    <div className="flex justify-between my-4">
                        <h1>Event</h1>
                        <p>Selengkapnya</p>
                    </div>
                    <div className=" grid gap-2 grid-rows grid-cols-3">
                        {event.map((value,key) => (

                            <Link to={`/detail/${value.id}`} className="" key={key}>
                            
                                <div className="block max-w-sm px-4 py-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

                                            
                                <img className="rounded-t-lg" src={`${value.main_img}`} alt=""  fetchpriority="high" loading="lazy" />
                            

                                <div className="my-3">
                                    <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white whitespace-normal truncate ">{value.name}</h5>
                                    <p className="font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>

                                    <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Read more
                                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                        </svg>
                                    </div>
                                </div>

                                </div>

                            </Link>
                        
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const SkeletonCardEvent = () => {

        let element = [];

        for (let index = 0; index < 3; index++) {
            element.push(
                <div className="col">
                    <div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center ">
                    <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                        <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                        </svg>
                    </div>
                    <div className="w-full">
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                    </div>
                    <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
        }
        return (
            <>
                {element.map((value,key) => (
                    <div key={key} className="grid grid-cols-1 md:grid-cols-6">
                        {value}
                    </div>
                ))}
            </>
        )
    }

    const Carousel = () => {
        let [count, setCount] = useState(0);
        let carousel_item = document.querySelectorAll('.carousel-item');

        useEffect(() => {
            if(count < carousel_item.length) {
                let interval = setInterval(() => {  
                    setCount(count+1);
                }, 3000);
                return () => {
                    clearInterval(interval)
                  }
            } else {
                setCount(0);
                let interval = setInterval(() => {  
                    setCount(count+1);
                }, 3000);
                return () => {
                    clearInterval(interval)
                  }
            }
        }, [count])
        

        return (
            <div className="my-5">
            
            <div id="indicators-carousel" className="relative w-full" data-carousel="static">
             
                <div className="relative h-56 overflow-hidden rounded-lg md:h-96">

                    {event.map((value,key) => (
                        
                        <div className={`${key === count ? '' : 'hidden'} duration-700 ease-in-out carousel-item`} data-carousel-item={`${key === count ? 'active' : ''}`} id={`carousel-item-${key}`} key={key}>
                            <img src={`${value.main_img}`} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"  alt="..."/>
                        </div>
                      
                    ))}
                       
                </div>
      
            </div>

            </div>
        )
    }
 
    const HomePageWrapper = () => {

        
        return (
            <> {isLoading ? <SkeletonCardEvent/> : <HomeContainer/> }</>
        )
    }

    return (
        <>
           <HomePageWrapper/>
        </>
    )
}

export default HomePage;