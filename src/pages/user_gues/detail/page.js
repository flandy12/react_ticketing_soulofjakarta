import { Link, Route, useParams, useRoutes } from "react-router-dom";
import {CallApi, GetKey} from "../../../helper/Api"
import { useEffect, useState } from "react";
import Navbar from "../../compoments/navbar";

import '../../css/detail.css';
import LoadingAnimation from "../../compoments/loading";
import AlertWarning from "../../compoments/alert";

const DetailPage = () => {

    // 👇️ get ID from url
    const params = useParams();
    const id = params.id;

    // 👇️ Next Url Checkout
    const nextPage = '/checkout';

    const [ticket, setTicket] = useState([]);
    const [name_event, setNameEvent] = useState('');
    const [main_img , setMainImage] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [start_time, setStartTime] = useState('');
    const [end_time, setEndTime] = useState('');
    const [city, setCity] = useState('');
    const [place, setPlace] = useState('');
    const [promotor, setPromotor] =  useState('');
    const [gate_opening_time, setGateOpeningTime] = useState('');
    const [description, setDescription] = useState('');
    const [information, setInformation] = useState('');    
    const [maximum_purchase_ticket, setMaximumPurchaseTicket] = useState(0);

    const [ticket_more_than_one_person, setTicketMoreThanOnePerson] = useState(0);

    const [additional_cost, setAdditionalCost] = useState(0);
    const [tax, setTax] = useState(0);

    //On click ticket click
    const [active_ticket, setActiveTicket] = useState(true);
    const [complimentaries, setComplimentaries]= useState([]);
    const [ticketComplimentries , setTicketComplimentaries] =  useState([]);

    const [alert_warning_element, setAlertWarningElement] = useState(false);

    let totalPriceAll = 0;
    let totalTicket = 0;

    useEffect(() => {
        API();
    }, [id])
    
    const API = () => {
        CallApi(`event-dashboard/view/${id}`,{
            method : 'GET',
            headers: {
                'x-client-token': GetKey,
                'Accept': 'application/json'
            }
        })
        .then(res => {
            console.log(res);
            if(res.success === true) {
                setTicket(res.results.tickets);
                setNameEvent(res.results.name);
                setMainImage(res.results.main_img);
                setStartDate(res.results.start_datefields);
                setStartTime(res.results.start_time);
                setEndTime(res.results.end_time);
                setCity(res.results.city);
                setTicketMoreThanOnePerson(res.results.ticket_more_than_one_person === true ? 1 : 0);
                setPlace(res.results.venue);
                setPromotor(res.results.promoter);
                setDescription(atob(res.results.description));
                setInformation(atob(res.results.information));
                setMaximumPurchaseTicket(res.results.maximum_purchase_ticket);

                setAdditionalCost(res.results.additional_cost);
                setTax(res.results.tax);

                setComplimentaries(res.results.complimentaries);
           
            }
            else {
                console.log(res);
            }
        }).catch((err) => {
            console.log(err);
        } )
    }
    
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

        const Remainding = ()   => {
            return (
                <> 
                    {!props.ticketSold ? 
                    (<div className="flex gap-6">
                    <button onClick={reduction} data-price={props.dataPrice} className="bg-yellow-300 font-semibold  h-7 w-7 rounded-full border">-</button>
                    <button className="font-semibold">{values}</button>
                    <button onClick={increment} data-price={props.dataPrice} className="bg-yellow-300 font-semibold  h-7 w-7 rounded-full border">+</button>
                    </div>) : <p className="text-red-500 font-semibold uppercase">Sold</p>}
                </>
            )
        }
        
        return(
            <div className="flex gap-6">
                <div>
                    <input type="hidden" id={`total_ticket_${props.dataKey}`} className={`total_ticket`} value={values}/>
                    <input type="hidden" id={`ticket_name_${props.dataKey}`} className={`ticket_name`} value={props.dataName}/>
                    <input type="hidden" id={`ticket_complimentaries_${props.dataKey}`} className={`ticket_complimentaries`} value=""/>
                    <input type="hidden" id={`total_price_ticket_${props.dataKey}`} className={`total_price_ticket_${props.dataKey}`} value={totalPrice}/>
                    <input type="hidden" id={`ticket_id_${props.dataKey}`} className={`ticket_id_${props.dataKey}`} value={props.dataId} />
                    <input type="hidden" id={`ticket_price_${props.dataKey}`} className={`ticket_price_${props.dataKey}`} value={props.dataPrice} />
                    <input type="hidden" id={`ticket_id_qty_${props.dataIdTicket}`} className={`ticket_id_qty`} value={props.dataIdTicket}/>
                </div>

                {props.DisableQtyInput === 0 ? <>
                
              
                <Remainding/>

                </> : <div className="flex gap-2">
                {countDisableQty ===  1 ? <button onClick={reductionDisableQty} data-price={props.dataPrice} className="font-semibold w-14 h-8 rounded border text-sm">Hapus</button> : ''}
                <button onClick={incrementDisableQty} data-price={props.dataPrice} className=" font-semibold w-14 h-8 rounded border text-sm mx-0">{countDisableQty ===  0 ? 'Pilih' : 'Dipilih'}</button>
                </div>
                }
              
            </div>
        )   
    }

    //SetupToLocalStorage
    const setLocalStorage = () => {

        let additional_cost_ = (parseInt(totalPriceAll) * parseFloat(additional_cost) / 100);
        let total_price = totalPriceAll + additional_cost_;
        let tax_cost = parseInt((total_price * tax) / 100) ;
        let totalPriceAlls = total_price + tax_cost;
        let totalPrice = totalPriceAll ;

        let total_ticket = document.querySelectorAll('.total_ticket');
        let ticket_id_qty = document.querySelectorAll('.ticket_id_qty');
        let ticket_more_than_one_person = document.getElementById('ticket_more_than_one_person').value;

        let DataLocalStorage = {
            'id_event' : id,
            'title' : name_event,
            'start_time' : start_time,
            'start_date' : start_date,
            'end_date' : end_date,
            'end_time' : end_time,
            'city' : city,
            'image' : main_img,
            'total_price' : totalPrice,
            'total_price_all' : totalPriceAlls,
            'total_ticket' : totalTicket,
            'place' : place,
            //Biaya Layanan = ( totalPriceAll * additional_cost) /100
            'additional_cost_' : additional_cost_,
            //Biaya Tax = ( totalPriceAll * ppn ) / 100
            'tax' : tax,
            'tax_cost' : tax_cost,
            // Validasi apakah dia dari page detail
            // Jika iya maka nilai true\
            'fromDetailPage' : true,
            'complimentaries' : complimentaries,
            'ticket' : [],
            'fields' : {},

            'ticket_more_than_one_person' : ticket_more_than_one_person ,
           
        }

        if(totalTicket <= maximum_purchase_ticket) {
            for (let count = 0; count < total_ticket.length; count++) {
                if(total_ticket[count].value > 0) {
                    DataLocalStorage['ticket'].push({
                        'name': document.getElementById('ticket_name_' + count).value,
                        'value': parseInt(document.getElementById('total_ticket_' + count).value),
                        'id': document.getElementById('ticket_id_' + count).value,
                        'price' : document.getElementById('ticket_price_'+ count).value,
                        'complimentari' : ticket[count].complimentaries,
                        'code' : ticket_id_qty[count].value,
                    });
                    
                    DataLocalStorage['fields']['qty_' + ticket_id_qty[count].value] = parseInt(document.getElementById('total_ticket_' + count).value);
                    localStorage.setItem('data-ticket' , JSON.stringify(DataLocalStorage));
                    window.location.href = nextPage;
                }
            }
        }

        if(totalTicket === 0) {
            setAlertWarningElement(true);
        }

    }

    //Close Alert
    const onClose = () => {
        if(alert_warning_element === true) {
            setAlertWarningElement(false);
        } else {
            setAlertWarningElement(true);
        }
    }

    return (
        <>
            <LoadingAnimation/>
            <div className={`flex justify-center z-50 relative ${alert_warning_element === true ? '' : 'hidden'}`}>
             <div id="alert-additional-content-1" className="p-4 mb-4 text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50  w-[500px] fixed top-10 " role="alert">
                <div className="flex items-center">
                    <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                    <h3 className="text-lg font-medium">Belum Memilih Tiket</h3>
                </div>
                <div className="mt-2 mb-4 text-sm">
                    Kuantitas tidak boleh melebihi maksimal ( {maximum_purchase_ticket} )
                </div>
                <div className="flex">
                  
                    <button type="button" className="text-yellow-800 bg-transparent border border-yellow-500 hover:bg-yellow-300 hover:text-white focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center  " data-dismiss-target="#alert-additional-content-1" aria-label="Close" onClick={onClose}>
                    Tutup
                    </button>
                </div>
                </div>
            </div>
            <Navbar/>
            <div className="container p-5 mx-auto">
                <div className="space-y-4"> 
                    <div className="grid grid-cols-5 max-md:grid-cols-1 max-md:gap-0 gap-3 mt-5">
                        <div className="col-span-3">
                            <div>
                                <h1 className="font-semibold text-xl mb-3">Detail Pemesanan</h1>
                            </div>
                            <div className="overflow-hidden">
                                { main_img === '' ? (
                                      <div className="skeleton w-full h-72 bg-slate-100 rounded"></div>
                                ) : (
                                    <picture>
                                    <img src={`${main_img}`} alt={`${name_event}`} className="overflow-hidden w-full" id="getImageEvent"/>
                                </picture>
                                )}
                            </div>

                        </div>
                        <div className="col-span-2 mx-4 shadow-md p-5 overflow-hidden h-full max-md:m-0">
                            <div className="space-y-4 flex flex-col align-baseline justify-between h-full bg-white ">
                                <div>
                                    <div><h1 className="font-semibold text-xl">{name_event}</h1></div>
                                    <div className="space-y-2 mt-6"> 
                                        <p className="text-base">Dates : {start_date} {end_date ? `- ${end_date}` : ''}</p>
                                        <p className="text-base">Time : {start_time} {end_time ? ` - ${end_time} WIB` : ''} </p>
                                        <p className="text-base">City : {city}</p>
                                    </div>

                                </div>
                                <hr/>
                                <div> <p className="font-semibold text-sm">Diselenggarakan Oleh</p>
                                    <div className="flex gap-5 mt-3">
                                        <div>
                                            <p className="">{promotor}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-5 gap-3 max-md:grid-cols-1 max-md:gap-0">
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
                                            <button type="button" className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-700 border border-gray-200 focus:ring-4 focus:ring-gray-200  gap-3 rounded" data-accordion-target="#accordion-open-body-1" aria-expanded="true" aria-controls="accordion-open-body-1" onClick={ActiveTicket}>
                                            <span className="flex items-center"><h2 className="font-semibold" >Tiket</h2></span>
                                            <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
                                            </svg>
                                            </button>
                                        </h2>
                                    </div>
                                    <div className={`bg-gray-100 py-3 mt-1 relative ${active_ticket ? '' : 'hidden'}`}>
                                    <input type="hidden" id="ticket_more_than_one_person" value={`${ticket_more_than_one_person}`}/>
                                    {ticket.map((value,key) => (
                                    
                                        <div className={`bg-gray-50 border my-3 px-3 py-2 rounded mx-4 ${value.disable_qty_input !== 0 ? 'cursor-pointer' : ''} `} key={key} >
                                            <div className="space-y-5">
                                                <div> <p className="font-semibold">{value.name}</p></div>
                                                <div>
                                                <p className="text-sm mt-5 line-clamp-none">Paket hemat 4 orang dalam 1 mobil + PHOTOBOOTH. Pukul 14.00 - 17.00. Apabila penumpang lebih, tiket tambahan dapat di beli di tempat</p>
                                                </div>
                                                <div> {value.remaining_qty_in_percentage === 1 && value.remaining_qty > 0 ? <>
                                                    <span className="text-green-600 font-semibold bg-green-300 px-3 py-2 rounded">Sisa Tiket {value.remaining_qty} % </span>
                                                    </> : value.remaining_qty <= 5 && value.remaining_qty > 0 ? <>
                                                    <span className="text-red-500 font-semibold bg-red-200 px-3 py-2 rounded">Sisa {value.remaining_qty} Tiket </span>
                                                </> : '' }
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-between items-center mt-12">
                                                <div>
                                                    <p className="mt-3 max-md:m-0 font-semibold">{value.price !== '0' ? value.price : 'GRATIS'}</p>
                                                </div>
                                            
                                                <ActionBtn dataPrice={value.price_value} dataKey={key} dataId={value.code} ticketSold={value.sold_out} DisableQtyInput={value.disable_qty_input} dataName={value.name} dataIdTicket={value.id} dataRemaindingInPercentage={value.remaining_qty_in_percentage} dataRemaindingQty={value.remaining_qty} />
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
                        <div className="col-span-2 mx-4 max-md:m-0 ">
                            <div className="p-5 space-y-5 mt-5 ">
                                <div className="flex items-center gap-5">
                                    <div className="">
                                        <picture className="">
                                            <img src={`/images/icon/icon_ticket_.svg`} alt={`${name_event}`} className="" id="getImageEvent"/>
                                        </picture>  
                                    </div>
                                <p className="text-base">Kamu belum memilih tiket. Silakan pilih lebih dulu di tab menu TIKET.</p>
                                </div>
                                <div> 
                                    <p className="font-semibold">Masukan Kode Promo</p>

                                    <div>
                                    
                                        <div className="relative mt-2 rounded-md shadow-sm z-10">
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
                            
                                        <button className="bg-yellow-300 w-full p-2 rounded-md font-semibold" onClick={setLocalStorage}>Beli</button>
                            
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailPage;