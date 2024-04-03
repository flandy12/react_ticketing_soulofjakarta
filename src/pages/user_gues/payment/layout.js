import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../compoments/navbar";
import LoadingAnimation from "../../compoments/loading";
import CountdownTimer from "../../compoments/count_down";
import { CallApi, GetKey } from "../../../helper/Api";

const LayoutPayment = () => {
    const [searchParams] = useSearchParams();
    const [transaction_id,setTransactionId] =  useState('');
    const getLocalStorage =  JSON.parse(localStorage.getItem(searchParams.get('generate'))); 
    const route_error = '/error';

    function createMarkup(data) {
        return {__html: data};
    }

    function WebSocketTicket(history) {
        try {
            var websocket = new WebSocket("wss://websocket.soulofjakarta.id:8090");
            websocket.onopen = function (event) {}
    
            websocket.onmessage = function (event) {
                var Data = JSON.parse(event.data);
                console.log(Data);
                if (Data.type === "success_payment") {
                    if (transaction_id) {
                        const formData = new FormData();
                        formData.append('trx_id', transaction_id.value);
                        formData.append('order_id', getLocalStorage.order_id);
                        CallApi(`v1/partner`, {
                            method: 'POST',
                            headers: {
                                'x-client-token': GetKey,
                                'Accept': 'application/json'
                            },
                            body: formData,
                        }).then(ress => {
                            if (ress.success === true) {
                                ResponUrl('/payment/finish');
                            } else {
                                console.log(ress);
                            }
                        });
                    } else {
                        ResponUrl(`/payment/finish?order=${history}`);
                    }
                } else if (Data.type === "error_payment") {
                    ResponUrl(`${route_error}?order=${history}`);
                }
            }
    
            websocket.onerror = function (event) {
                console.log(event);
            };
    
            websocket.onclose = function (event) {
                console.log(event);
            };
            SendWebsocket();
        } catch (error) {
            alert('Silahkan Refresh Page Ini')
        }
    
        function SendWebsocket() {
            if (websocket.readyState) {
    
                let history_localStorage = JSON.parse(localStorage.getItem(history));
    
                var data = {
                    command: "register",
                    userId: history_localStorage.uuid,
                };
    
                websocket.send(JSON.stringify(data));
            } else {
                setTimeout(SendWebsocket, 1000);
            }
        }
    }

    function ResponUrl(url) {
        setTimeout(() => {
            localStorage.removeItem('data-ticket');
            // localStorage.removeItem('user_data_guest');
        }, 1000);
        setTimeout(() => {
            window.location.href = url;
        }, 1500);
    }
    
    const Payment = () => {
        
        const BankTransfer = () => {
            return (
                <>
                    <div className="flex flex-col justify-between space-y-3">
                        <div className="bg-blue-50 p-2 rounded border font-semibold capitalize">
                        {/* {searchParams.paymenttype === 'bank_transfer'? 'Virtual' : ''}  */}
                        <span className="uppercase">{getLocalStorage.payment_code}</span></div>
                        
                        <div className="flex justify-between bg-slate-100 px-2 py-2 border rounded">
                            <span className="font-semibold text-xl">{getLocalStorage.va_numbers}</span>
                            <span className="bg-slate-200 px-5 rounded font-normal cursor-pointer">Copy</span>
                        </div>
                    </div>  
                    <div className="mt-4">
                    <div className="flex justify-between">
                            <span>Invoice</span>
                            <span>#31201121</span>
                    </div>

                    <div className="mt-5">
                    <div className="flex justify-between">
                            <span>Biaya Layanan</span>
                            <span className="">IDR 10.000</span>
                    </div>
                    <div className="flex justify-between">
                            <span>Biaya Tax</span>
                            <span className="">IDR 10.000</span>
                    </div>
                    <div className="flex justify-between mt-5">
                            <span className="font-semibold">Total</span>
                            <span className="font-semibold ">IDR {new Intl.NumberFormat().format(getLocalStorage.price)}</span>
                    </div>

                    <div className="list-disc item-information" dangerouslySetInnerHTML={createMarkup(getLocalStorage.information)} />

                    </div>
                    </div>
                </>
            )
        };

        const InstantPayment = () => {
            return (
                <>
                    <div className="flex flex-col max-md:flex-col justify-between space-y-3">
                        <div className="bg-blue-50 p-2 rounded border font-semibold capitalize">
                        {/* {searchParams.paymenttype === 'bank_transfer'? 'Virtual' : ''}  */}
                        <span className="uppercase">{getLocalStorage.payment_name}</span></div>
                    </div>  
                    <div className="mt-4">

                    <div className="mt-5">
                    <div className="flex justify-between mt-5">
                            <span className="font-semibold">Total Pembayaran</span>
                            <span className="font-semibold ">IDR {new Intl.NumberFormat().format(getLocalStorage.price)}</span>
                    </div>

                    <div className="my-5">
                        <img src={getLocalStorage.logo} alt="logo-payment" />
                    </div>

                    <div className="list-disc item-information" dangerouslySetInnerHTML={createMarkup(getLocalStorage.information)} />
                    <button className="bg-yellow-300 py-2 px-5 mt-5 rounded font-semibold">
                       <Link to={getLocalStorage.redirect_url} target={"_blank"} >Open App</Link>
                    </button>

                    </div>
                    </div>
                </>
            )
        };

        const RouteLayout = () => {
           
            switch (searchParams.get('paymenttype')) {
                case 'bank_transfer':
                    return <BankTransfer/>;
                case 'permata':
                    return <BankTransfer/>;
                case 'instant_payment':
                    return <InstantPayment/>;
                default:
                    break;
            }
        }

        return (
            <div className="container mx-auto">
                <div className="flex max-md:flex-col-reverse gap-5 w-full h-max py-20">
                    <div className="w-[40%] max-md:w-full bg-slate-50 p-5 border rounded-xl">
                    <RouteLayout/>
                    </div>
                    <div className="w-full p-10 space-y-5 bg-slate-50 border rounded-xl">
                        <CountdownTimer time={getLocalStorage.invoice_expired_at} history_ticket = {getLocalStorage.invoice_id}/>

                        <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow max-md:p-5">
                            <img className="object-cover w-[50%] h-3/6 rounded-t-lg md:h-auto md:rounded-none md:rounded-s-lg max-md:rounded" src={getLocalStorage.img_ticket} alt="" />
                            <div className="flex flex-col justify-between p-4 leading-normal  w-[60%]">
                                <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 ">{getLocalStorage.name_event}</h5>
                                <div className="flex justify-between">
                                    <span>Date</span>
                                    <span>18 Sep 2023 - 19 Sep 2023</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Time</span>
                                    <span>14:00 - 14:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Location</span>
                                    <span>Jakarta</span>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    useEffect(() => {
      WebSocketTicket(searchParams.get('generate'));
    }, [WebSocketTicket])

    return (
        <div>
            <LoadingAnimation/>
           

         
            <Navbar/>

            {
                getLocalStorage ? (
                    <Payment/>
                ) : (window.location.href = '/')
            }



           
        </div>
    )
}

export default LayoutPayment;