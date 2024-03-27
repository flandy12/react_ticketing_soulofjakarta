import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../../compoments/navbar";
import {CallApi,GetKey} from "../../../helper/Api";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import LoadingAnimation from "../../compoments/loading";

const PageCheckout = () => {
    const [ip, setIP] = useState('');
    const getLocalStorage =  JSON.parse(localStorage.getItem('data-ticket')); 
    const nextPage = '/payment-method';
    const [click_button_buy, setClickButtonBuy] = useState(false);
    const [queue_number, setQueueNumber] = useState(0);
    const [status_checked, setTermsCondition] = useState(null);
    const username = useRef('');
    const id_card_number = useRef('');
    const phone_number = useRef('');
    const email = useRef('');
    const [gender,setGender] = useState(0);
    const [order_id , setOrderId] = useState('');
   
    const [transaction_id, setTransactionId] = useState('');

    const {id} = useSearchParams();
    const [productId, setProductId] =  useState(0);

    const GetIpAddress = async () => {
        try {
           const response = await fetch("https://geolocation-db.com/json/");
           const data = await response.json();
           setIP(data.IPv4);
         } catch (error) {
           console.log(error);
         }
    }

    const CallAPIChcekout = (formdata) => {        
        CallApi(`v1/checkout/${getLocalStorage.id_event}`, {
            method: 'POST',
            headers: {
                'x-client-token': GetKey,
                'Accept': 'application/json',
            },
            body: formdata
        }).then(ress => {
            console.log(ress);
            if(ress.success === true) {
                setClickButtonBuy(true);
                getLocalStorage['ip_address'] =  ip;
                // Menit yang diperlukan untuk memilih metode pembayaran;
                getLocalStorage['expired_method_payment'] = 60 ;
                if (ress.results.queue_number === 1) {
                    setQueueNumber(ress.results.queue_number);
                    setOrderId(ress.results.order_id);
                    getLocalStorage['order_id'] = ress.results.order_id;  
                    localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));
                } else {
                    setQueueNumber(ress.results.queue_number);
                    setOrderId(ress.results.order_id);
                    getLocalStorage['order_id'] = ress.results.order_id;  
                    localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));
                }
            } else {
                setClickButtonBuy(false);
                let error_message = ress.errors;
                setTimeout(() => {
                    Object.keys(error_message).forEach((value,key) => {
                        let error_messagee = document.getElementById(value);
                        if(error_messagee) {
                            error_messagee.innerHTML = error_message[value][0];
                        } 
                    });    
                }, 200);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const SubmitTicket = (e) => {
        setClickButtonBuy(true); 
        const uuid = document.getElementById('uuid').value;
        e.preventDefault();
         // Jika Jenis tike merupakan ticket_more_than_one_person
        if (getLocalStorage.ticket_more_than_one_person === '1') {
        
            let formdata = new FormData();

            for (let index = 0; index < getLocalStorage.total_ticket; index++) {
                let user = [];
                user.push({
                    'name' : document.getElementById(`name_${index}`).value,
                    'id_card_number' : document.getElementById(`id_card_number_${index}`).value,
                    'phone' : '62' + document.getElementById(`phone_number_${index}`).value,
                    'email' : document.getElementById(`email_${index}`).value,
                    'gender' : document.getElementById(`gender_${index}`).options[document.getElementById(`gender_${index}`).selectedIndex].value,
                });

                getLocalStorage['user_data_guest'] = user;
                getLocalStorage['uuid'] = uuid;
                getLocalStorage['id_passing'] = 0;

                formdata.append('name', document.getElementById( `name_${index}`).value);    
                formdata.append('email', document.getElementById( `email_${index}`).value); 
                formdata.append('id_card_number', document.getElementById( `id_card_number_${index}`).value); 
                formdata.append('gender', document.getElementById(`gender_0`).options[document.getElementById(`gender_${index}`).selectedIndex].value); 
                formdata.append(`phone_number`, '62' + document.getElementById( `phone_number_${index}` ).value);

                for (let count = 0; count < getLocalStorage.ticket.length; count++) {
                    formdata.append(`ticket_owner_name_${getLocalStorage.ticket[count].code}[]`, document.getElementById(`name_${index}`).value);
                    formdata.append(`ticket_owner_email_${getLocalStorage.ticket[count].code}[]`, document.getElementById(`email_${index}`).value);
                    formdata.append(`ticket_owner_id_card_number_${getLocalStorage.ticket[count].code}[]`, document.getElementById( `id_card_number_${index}`).value);
                    formdata.append(`ticket_owner_phone_number_${getLocalStorage.ticket[count].code}[]`, parseInt('62' + document.getElementById( `phone_number_${index}`).value));
                }
                
            }
            
            formdata.append('uuid', uuid);
            formdata.append('term_and_condition', status_checked);
            formdata.append('ip_address', ip);
            Object.keys(getLocalStorage.fields).forEach(function (value,key) {
                formdata.append(value, getLocalStorage.fields[value]); 
            });

            localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));
            // CallAPIChcekout(formdata);
            // console.log(document.getElementById(`phone_number_0`).value);
        } else {
            const formDataUser = document.getElementById('formDataUser');
            const error_text = document.querySelectorAll('.error-text');
            for (let index = 0; index < error_text.length; index++) {
                error_text[index].textContent = '';
            }
            let formdata = new FormData(formDataUser);
            formdata.append('gender', gender);
            formdata.append('term_and_condition', status_checked);
            formdata.append('uuid', uuid);
            formdata.append('phone_number', '62'+ phone_number.current.value)
            formdata.append('ip_address', ip);
            Object.keys(getLocalStorage.fields).forEach(function (value,key) {
                formdata.append(value, getLocalStorage.fields[value]); 
            });
            // Add Local Storage user_data_guest 
            getLocalStorage['uuid'] = uuid;
            getLocalStorage['user_data_guest'] = {
                'name': username.current.value,
                'phone_number': '62'+ phone_number.current.value,
                'email': email.current.value,
                'id_card_number': id_card_number.current.value,
                'gender': parseInt(gender),
            }
            //ID Passing URL
            getLocalStorage['id'] = productId ;
            localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));
            CallAPIChcekout(formdata);
        }
    }

    const HandleChangeGender = (event) =>{
        setGender(1)
    }

    const CheckboxItem = () => {
        const [ischecked, setIschecked] = useState(0);
        const checkHandler = () => {
            if(ischecked === 0) {
                setIschecked(1);
                setTermsCondition(1);
            } else {
                setIschecked(0);
                setTermsCondition(null);
            }
        }

        return (
            <div>
                <div className="flex items-start mb-6">
                    <div className="flex items-center h-5">

                        <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300  dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" checked={ischecked === 0 ? false : true } name="term_and_condition"
                        onChange={checkHandler} />

                    </div>
                    <label className="ms-2 text-sm font-medium text-gray-900 ">Saya setuju dengan <Link to="#" className="text-red-600 hover:underline">Syarat & Ketentuan </Link> yang berlaku di tiket.soulofjakarta.id *
                    </label>
                </div>
                <p className="text-red-600 error-text" id="term_and_condition"></p>
            </div>
        )
    }

    const InputForm = () => {
        const ticketElements = [];
        for (let index = 0; index < getLocalStorage.total_ticket; index++) {
            ticketElements.push(
                <div key={index}>
                            <div className="mb-6" >
                                <label className="block mb-2 text-sm font-medium text-red-500 ">Data Tiket Ke -{index + 1}</label>
                                <label className="block mb-2 text-sm font-medium text-gray-900 ">Nama Lengkap*</label>
                                <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder=""  id={`name_${index}`}/>
                                <p className="text-red-600 error-text" id={`name_err_${index}`}></p>
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 text-sm font-medium text-gray-900">NIK*</label>
                                <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="12121*" id={`id_card_number_${index}`}/>
                                <p className="text-red-600 error-text" id={`id_card_number_err_${index}`}></p>
                            </div> 
                            <div className="mb-6">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Nomor Ponsel*</label>
                            <div className="flex gap-4 text-center place-content-center align-content-center justify-center">
                                    <span className="font-semibold flex place-content-center align-content-center m-auto">+62</span>
                                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " id={`phone_number_${index}`}placeholder="881-****-****" />
                                </div>
                                <p className="text-red-600 error-text" id={`phone_number_err_${index}`}></p>
                            </div> 
                            <div className="mb-6">
                                <label  className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input type="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Email Address" id={`email_${index}`} />
                                <p className="text-red-600 error-text" id={`email_err_${index}`}></p>
                            </div> 

                            <div className="mb-6">
                                <label  className="block mb-2 text-sm font-medium text-gray-900">Gender</label>
                                <select id={`gender_${index}`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " >
                                    <option value="0">Pria</option>
                                    <option value="1">Wanta</option>
                                </select>
                                <p className="text-red-600 error-text" id="gender"></p>
                            </div> 
                </div>
            )
        }
        return (
            <div>
                {ticketElements}
            </div>
        )
    }

    const TicketOneMorePerson = () => {
        return (
            <div>
                <form id="formDataUser" className={`${getLocalStorage.ticket_more_than_one_person === '0' ? 'block' : 'hidden'}`}> 
                  
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900 ">Nama Lengkap*</label>
                        <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Masukan Nama" name='name' required ref={username} />
                        <p className="text-red-600 error-text" id="name"></p>
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900">NIK*</label>
                        <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="1884 - 8819 - 9881 - 1121" required name="id_card_number" ref={id_card_number}/>
                        <p className="text-red-600 error-text" id="id_card_number"></p>
                    </div> 
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Nomor Ponsel*</label>
                        <div className="flex gap-4 text-center place-content-center align-content-center justify-center">
                            <span className="font-semibold flex place-content-center align-content-center m-auto">+62</span>
                            <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="881-****-****"  ref={phone_number}/>
                        </div>
                        <p className="text-red-600 error-text" id="phone_number"></p>
                    </div> 
                    <div className="mb-6">
                        <label  className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                        <input type="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Alamat Email" name="email" ref={email}/>
                        <p className="text-red-600 error-text" id="email"></p>
                    </div> 
                    <div className="mb-6">
                        <label  className="block mb-2 text-sm font-medium text-gray-900">Gender</label>
                        <select id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " onChange={HandleChangeGender}>
                            <option value="0">Pria</option>
                            <option value="1">Wanta</option>
                        </select>
                        <p className="text-red-600 error-text" id="gender"></p>
                    </div> 

                </form>   
            </div>
        )
    }

    const TicketMoreThanOneMorePerson = () => {
        return (
            <form id="FormDataUserOneMorePreson" className={`${getLocalStorage.ticket_more_than_one_person === '1' ? 'block' : 'hidden'}`}> 

            {<InputForm/>}           
                            
            </form> 
        )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function WebsocketTest() {
        const getLocalStorage =  JSON.parse(localStorage.getItem('data-ticket')); 
        var websocket = new WebSocket("wss://websocket.soulofjakarta.id:8090");
        websocket.onopen = (event) => { };

        websocket.onmessage = (event) => {
            var Data = JSON.parse(event.data);
            // Jika queue update 
            if (typeof Data.queue !== "undefined") {

                if (Data.free === true) {
                    window.location.href = '/success';
                } else {
                    if (Data.queue === 0) {

                        // Jika total tiket yang di beli lebih besar dari 0 rupiah
                        if (getLocalStorage.total_price > 0) {
                            if (transaction_id) {
                                window.location.href = `${nextPage}?orderid=${document.getElementById('order-id').value}&transaction_id=${transaction_id}`;
                            } else {
                                window.location.href = `${nextPage}?orderid=${document.getElementById('order-id').value}`;
                            }
                        } else {
                            window.location.href = '/succes';
                        }
                    } else {
                        setQueueNumber(Data.queue);
                    }
                }
            }
            // Jika queue terjadi error
            if (Data.type === "queue_ticket_error") {
                window.location.href = "/error";
            }

            // Jika Kursi terjadi error
            if (Data.type === "seat_not_available") {
                alert(Data.message);
                window.location.href = '/';
            }

            if (Data.type === "out_of_stock") {
                alert(Data.message);
                window.location.href = '/';
            }
        };

        websocket.onerror = (event) => {
        };

        websocket.onclose = (event) => {
        };

        function SendWebsocket() {
            if (websocket.OPEN === websocket.readyState) {
                var data = {
                    command: "register",
                    userId: document.getElementById('uuid').value,
                };
                websocket.send(JSON.stringify(data));
            } else {
                setTimeout(SendWebsocket, 1000);
            }
        }

        SendWebsocket();
    }
        
    useEffect(() => {
        GetIpAddress();
        if(id) {
            setProductId(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        WebsocketTest();
    }, [WebsocketTest]);
    
   
    const CheckoutPage = () => {
        
        return (
            <div className="overflow-y-hidden">
                <div className="relative">
                    <ModalQueeing queue={queue_number}/>
                    <div className="container mx-auto overflow-y-hidden">
                    <div className="grid grid-cols-6 gap-6 mx-5 inset-1 relative overflow-y-hidden">
                    <div className="col-span-4 ">
                        <div className="">
                            <h1 className="font-semibold text-xl my-9">Detail Pemesanan</h1>
                            <div className="space-y-3 bg-white border border-gray-200 rounded-lg shadow md:flex-row px-3 py-4">
                                    
                                <div className="xl:grid grid-cols-2">
                                    <div className="w-full h-full">
                                            <img className="object-cover rounded-t-lg  md:h-auto md:rounded-none md:rounded-s-lg" src={getLocalStorage.image} alt="" />
                                    </div>
                                    <div className="justify-between p-4 leading-normal">
                                        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                                            {getLocalStorage.title}
                                        </h5>
                                        
                                        <div className="space-y-2 mt-2"> 
                                            <p className="font-normal">Dates : {getLocalStorage.start_date} {getLocalStorage.end_date ? `- ${getLocalStorage.end_date}` : ''}</p>
                                            <p className="font-normal">Time : {getLocalStorage.start_time} {getLocalStorage.end_time ? `- ${getLocalStorage.end_time}` : ''}  WIB</p>
                                            <p className="font-normal">City : {getLocalStorage.city}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="grid grid-cols-3">
                                        <span className="font-semibold text-lg">Jenis Tiket</span>
                                        <span className="font-semibold text-lg">Harga</span>
                                        <span className="font-semibold text-lg">Jumlah</span>
                                    </div>
                                    {getLocalStorage.ticket.map((value,key) => (
                                        <div className="grid grid-cols-3" key={key}>  
                                            <span className="text-lg">{value.name}</span>
                                            <span className="text-lg">{new Intl.NumberFormat().format(value.price)}</span>
                                            <span className="text-lg">X {value.value}</span>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                        <div className="">
                            <h1 className="font-semibold text-xl my-9">Detail Pemesan</h1>
                            <div className="space-y-3 bg-white border border-gray-200 rounded-lg shadow md:flex-row px-5 py-5">
                            <input type="hidden" id="uuid" value={uuidv4()} />
                            <TicketOneMorePerson/>
                            <TicketMoreThanOneMorePerson/>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 mt-16 start-4 space-y-5">
                        <div className="shadow p-5 space-y-3 rounded-lg border">
                            <div className="gap-5">
                                <h1 className="font-semibold">Detail Harga</h1>
                            </div>
                    
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <p>Total Harga Tiket</p>
                                    <div className="flex gap-3">
                                        <p>IDR</p>
                                        <p>{new Intl.NumberFormat().format( getLocalStorage.total_price )}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <p>Biaya Layanan</p>
                                    <div className="flex gap-3">
                                        <p>IDR</p>
                                        <p>{new Intl.NumberFormat().format( getLocalStorage.additional_cost_ )}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <p>Biaya Tax</p>
                                    <div className="flex gap-3">
                                        <p>IDR</p>
                                        <p>{ new Intl.NumberFormat().format(  getLocalStorage.tax_cost ) }</p>
                                    </div>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <p>Total Bayar</p>
                                    <div className="flex gap-3 font-semibold">
                                        <p>IDR</p>
                                        <p>{ new Intl.NumberFormat().format(  getLocalStorage.total_price_all ) }</p>
                                    </div>
                                </div>

                                <input type="hidden" id="order-id" value={order_id}/>
                            </div>

                            <div className="flex justify-between">
                                <p className="font-semibold">Harga</p>
                                <div className="flex gap-3 font-semibold">
                                    <p>IDR</p>
                                    <p> {new Intl.NumberFormat().format(getLocalStorage.total_price_all) }</p>
                                </div>
                            </div>
                            
                            <CheckboxItem />
                            <div className="mt-4">
                            
                                <button className="bg-yellow-300 w-full p-2 rounded-md font-semibold" onClick={SubmitTicket}>Beli</button>
                            
                            </div>
                        </div>
                        <div>
                            <picture>
                                <source type="image/webp" srcSet="https://t.soulofjakarta.id/images/PREMIUM-BANNER-v3.jpg" />
                                <img src="https://t.soulofjakarta.id/images/PREMIUM-BANNER-v3.jpg" alt=""/>
                            </picture>
                        </div>
                    </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }

    const ModalQueeing = (props) => {
        return (
            <div className={`bg-black-opacity min-h-screen absolute z-10 inset-0 ${props.queue > 1 ? 'block' : 'hidden'}`}>
                  
                <div className="flex justify-center ">
                    

                    <div id="popup-modal" className="overflow-y-auto overflow-x-hidden fixed  right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ">
                        <div className="relative p-4 w-full max-w-md max-h-full m-auto top-20">
                            <div className="relative bg-white rounded-lg shadow ">
                               
                                <div className="p-4 md:p-5 text-center">
                                    <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                    </svg>
                                    <h3 className="mb-2 text-lg text-gray-500 capitalize font-semibold">Anda masuk dalam antrian ke-<span className="text-red-500 font-semibold">{props.queue}</span></h3>
                                    <span className="text-gray-500 px-3">Mohon menunggu untuk melakukan pembayaran. Mohon tidak merefresh
                                        dan pindah dari halaman ini. Terima kasih</span>
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
    
    return (
       <>
        <LoadingAnimation click={click_button_buy}/>
        <Navbar/>
        
        {getLocalStorage ? <CheckoutPage/> : ''}
        </>

    )
}

export default PageCheckout;