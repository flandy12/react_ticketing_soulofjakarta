import { Link, Route, useParams } from "react-router-dom";
import CallApi from "../../helper/Api";
import { useEffect, useState } from "react";
import Navbar from "../compoments/navbar";

import '../css/detail.css';

const DetailPage = () => {

    // 👇️ get ID from url
    const params = useParams();
    const id = params.id;

    const [ticket, setTicket] = useState([]);
    const [name_event, setNameEvent] = useState('');
    const [main_img , setMainImage] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [start_time, setStartTime] = useState('');
    const [end_time, setEndTime] = useState('');
    const [city, setCity] = useState('');
    const [promotor, setPromotor] =  useState('');
    const [gate_opening_time, setGateOpeningTime] = useState('');
    const [description, setDescription] = useState('');
    const [information, setInformation] = useState('');    
    const [maximum_purchase_ticket, setMaximumPurchaseTicket] = useState(0);

    //On click ticket click
    const [active_ticket, setActiveTicket] = useState(false);


    let totalPriceAll = 0;
    let totalTicket = 0;

    useEffect(() => {
        CallApi(`event-dashboard/view/${id}`, 'GET')
        .then(ress => {
            if(ress.success === true) {
                setTicket(ress.results.tickets);
                setNameEvent(ress.results.name);
                setMainImage(ress.results.main_img);
                setStartDate(ress.results.start_date);
                setStartTime(ress.results.start_time);
                setEndTime(ress.results.end_time);
                setCity(ress.results.city);
                setPromotor(ress.results.promoter);
                setDescription(atob(ress.results.description));
                setInformation(atob(ress.results.information));
                setMaximumPurchaseTicket(ress.results.maximum_purchase_ticket);
                console.log(ress);
            }
            else {
                console.log(ress);
            }
        })
    }, [id])
    

    function createMarkup(text) {
        return {__html: text};
    }

    function ActiveTicket () {
       
        if(active_ticket === true) {
            setActiveTicket(false);
        } else {
            setActiveTicket(true);
        }
    }

    const ActionBtn = (props) => {
        const [values, setValue] = useState(0);
        const [totalPrice, setTotalPrice] = useState(0);

        //On click ticket click
        const [countDisableQty, setCountDisableQty] = useState(0);

        let totalPriceText = document.getElementById('totalPrice');
        
        const increment = (e) => {
           
            if(totalTicket >= maximum_purchase_ticket) {
                alert('maaf kamu telah melewati batas');
            } else {
                setValue(values + 1);
                setTotalPrice(parseInt(e.target.getAttribute('data-price')) + totalPrice);
    
                totalPriceAll = parseInt(e.target.getAttribute('data-price')) + totalPriceAll;
                totalPriceText.innerHTML  = new Intl.NumberFormat().format(totalPriceAll) ;
                
                totalTicket = totalTicket + 1;

                console.log(totalTicket);
            }
        
        };
        
        const reduction = (e) => {

            if(values > 0) {
                setValue(values - 1);
                setTotalPrice( totalPrice - parseInt(e.target.getAttribute('data-price')) );
                totalTicket = totalTicket - 1;
                totalPriceAll = totalPriceAll - parseInt(e.target.getAttribute('data-price')) ;
                totalPriceText.innerHTML  = new Intl.NumberFormat().format(totalPriceAll) ;
            }
        }
        
        const incrementDisableQty = (e) => {

            if(totalTicket >= maximum_purchase_ticket) {
                alert('maaf kamu telah melewati batas');
            } else {
                setValue(values + 1);
                setTotalPrice(parseInt(e.target.getAttribute('data-price')) + totalPrice);
                setCountDisableQty(countDisableQty + 1);
                totalPriceAll = parseInt(e.target.getAttribute('data-price')) + totalPriceAll;
                totalPriceText.innerHTML  = new Intl.NumberFormat().format(totalPriceAll) ;
                
                totalTicket = totalTicket + 1;
            }

        };


        const reductionDisableQty = (e) => {
            if(values > 0) {
                setCountDisableQty(countDisableQty - 1);
                setTotalPrice( totalPrice - parseInt(e.target.getAttribute('data-price')) );
                totalTicket = totalTicket - 1;
                totalPriceAll = totalPriceAll - parseInt(e.target.getAttribute('data-price')) ;
                totalPriceText.innerHTML  = new Intl.NumberFormat().format(totalPriceAll) ;
            }
        };
        

        return(
            <div className="flex gap-6">
                <div>
                    <input type="hidden" id={`total_ticket_${props.dataId}`} className={`total_ticket`} value={values}/>
                    <input type="hidden" id={`total_price_ticket_${props.dataId}`} className={`total_price_ticket_${props.dataId}`} value={totalPrice}/>
                </div>

                {props.DisableQtyInput === 0 ? <>
                
                {!props.ticketSold ? <div className="flex gap-6">
                <button onClick={reduction} data-price={props.dataPrice} className="bg-yellow-300 font-semibold  h-7 w-7 rounded-full border">-</button>
                <button className="font-semibold">{values}</button>
                <button onClick={increment} data-price={props.dataPrice} className="bg-yellow-300 font-semibold  h-7 w-7 rounded-full border">+</button>
                </div> : <p className="text-red-500 font-semibold uppercase">Sold</p>}

                </> : <div className="flex gap-2">
                {countDisableQty ===  1 ? <button onClick={reductionDisableQty} data-price={props.dataPrice} className="font-semibold w-14 h-8 rounded border text-sm">Hapus</button> : ''}
                <button onClick={incrementDisableQty} data-price={props.dataPrice} className=" font-semibold w-14 h-8 rounded border text-sm mx-0">{countDisableQty ===  0 ? 'Pilih' : 'Dipilih'}</button>
                </div>
                }
              
            </div>
        )   
    }

    const setLocalStorage = () => {

        let DataLocalStorage = {
            'title' : name_event,
            'start_time' : start_time,
            'start_date' : start_date,
            'end_date' : end_date,
            'end_time' : end_time,
            'city' : city,
            'image' : main_img,
            'id_event' : id,
            'total_price' : totalPriceAll,
        }
        
        localStorage.setItem('data-user' , JSON.stringify(DataLocalStorage));

    }

    return (
        <div className="container mx-auto">
            <Navbar/>
           <div className="space-y-4"> 
                <div className="grid grid-cols-5 gap-3 mt-5">


                    <div className="col-span-3">
                        <div>
                            <h1 className="font-semibold text-xl mb-3">Detail Pemesanan</h1>
                        </div>
                        <div className="overflow-hidden">
                            <picture>
                                <img src={`${main_img}`} alt={`${name_event}`} className="overflow-hidden w-full" id="getImageEvent"/>
                            </picture>
                        </div>

                    </div>
                    <div className="col-span-2 mx-4 shadow-md p-5 overflow-hidden h-full">
                        <div className="space-y-4 flex flex-col align-baseline justify-between h-full bg-white ">
                            <div>
                                <div><h1 className="font-semibold text-xl">{name_event}</h1></div>
                                <div className="space-y-2 mt-6"> 
                                    <p className="text-base">Dates : {start_date} {end_date ? `- ${end_date}` : ''}</p>
                                    <p className="text-base">Time : {start_time} {end_time ? ` - ${end_time}` : ''} WIB</p>
                                    <p className="text-base">City : {city}</p>
                                </div>

                            </div>
                            <hr/>
                            <div> <p className="font-semibold text-sm">Diselenggarakan Oleh</p>
                                <div className="flex gap-5 mt-3">
                                    <div className="">
                                        <picture className="">
                                            <img src={`https://images.unsplash.com/photo-1703457030593-df7ec73712f2?q=80&w=1370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`} alt={`${name_event}`} className="overflow-hidden h-10 w-10 object-cover rounded-full " id="getImageEvent"/>
                                        </picture>  
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Promotor</p>
                                        <p className="">{promotor}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-5 gap-3 ">
                    <div className="col-span-3 bg-white px-5 py-3 border mb-5">
                        <div className="space-y-9">
                            <div>
                                <h2 className="font-semibold">Informasi Event</h2>
                                <div dangerouslySetInnerHTML={createMarkup(information)} className="mt-5 detail-information border rounded p-3 bg-gray-100" />
                            </div>
                            <div>
                                <h2 className="font-semibold">Deskripsi</h2>
                                <div dangerouslySetInnerHTML={createMarkup(description)} className="mt-5 detail-information border rounded p-3 bg-gray-100" />
                            </div>
                            <div>
                                <div>
                                    <input type="hidden" value={maximum_purchase_ticket} id={`maximum_purchase_ticket`}/>
                                    <h2 id="accordion-open-heading-1">
                                        <button type="button" className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-700 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 rounded" data-accordion-target="#accordion-open-body-1" aria-expanded="true" aria-controls="accordion-open-body-1" onClick={ActiveTicket}>
                                        <span className="flex items-center"><h2 className="font-semibold" >Tiket</h2></span>
                                        <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                        </svg>
                                        </button>
                                    </h2>
                                </div>
                                <div className={`bg-gray-50 py-3 mt-1 relative ${active_ticket ? '' : 'hidden'}`}>
                                {ticket.map((value,key) => (
                                    <div className={`bg-gray-100 border my-3 px-3 py-2 rounded mx-4 ${value.disable_qty_input !== 0 ? 'cursor-pointer' : ''} `} key={key} >
                                        <div>
                                            <p className="font-normal">{value.name}</p>
                                            <p className="text-sm mt-5 line-clamp-1">Paket hemat 4 orang dalam 1 mobil + PHOTOBOOTH. Pukul 14.00 - 17.00. Apabila penumpang lebih, tiket tambahan dapat di beli di tempat</p>
                                        </div>
                                        
                                        <div className="flex justify-between mt-12">
                                            <div>
                                                <p className="mt-3 font-semibold">{value.price !== '0' ? value.price : 'GRATIS'}</p>
                                            </div>
                                          
                                            <ActionBtn dataPrice={value.price_value} dataId={key} ticketSold={value.sold_out} DisableQtyInput={value.disable_qty_input}/>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </div>
                            <div>
                                <h2 className="font-semibold">Syarat & Ketentuan</h2>
                                <div dangerouslySetInnerHTML={createMarkup(description)} className="mt-5 detail-information border rounded p-3 bg-gray-100" />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 mx-4 ">
                        <div className="p-5 space-y-5 mt-5 ">
                            <div className="flex gap-5">
                                <div className="">
                                    <picture className="">
                                        <img src={`https://images.unsplash.com/photo-1703457030593-df7ec73712f2?q=80&w=1370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`} alt={`${name_event}`} className="h-10 w-10 object-cover rounded-full" id="getImageEvent"/>
                                    </picture>  
                                </div>
                                <p className="text-base">icon_ticket Kamu belum memilih tiket. Silakan pilih lebih dulu di tab menu TIKET.</p>
                            </div>
                            <div> 
                                <p className="font-semibold">Masukan Kode Promo</p>

                                <div>
                                   
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                          <span className="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                        <input type="text" name="price" id="price" className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                                        
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between font-semibold">
                                <p>Potongan Harga</p>
                                <div className="flex gap-3 font-semibold">
                                    <p>IDR</p>
                                    <p>0</p>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <p className="font-semibold">Harga</p>
                                <div className="flex gap-3 font-semibold">
                                    <p>IDR</p>
                                    <p id="totalPrice">{new Intl.NumberFormat().format(totalPriceAll) }</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link to="/checkout" onClick={setLocalStorage}>
                                    <button className="bg-yellow-300 w-full p-2 rounded-md font-semibold">Beli</button>
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailPage;