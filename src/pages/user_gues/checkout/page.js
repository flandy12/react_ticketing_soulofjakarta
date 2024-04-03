import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import Navbar from "../../compoments/navbar";
import {CallApi,GetKey} from "../../../helper/Api";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import LoadingAnimation from "../../compoments/loading";

const PageCheckout = () => {
    const getLocalStorage =  JSON.parse(localStorage.getItem('data-ticket')); 
    const nextPage = '/payment-method';
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const EventParsUrl = searchParams.get('event');

    const [click_button_buy, setClickButtonBuy] = useState(false);
    const [queue_number, setQueueNumber] = useState(0);
    
    //FORM DATA
    const uuid = uuidv4();
    const [ip, setIP] = useState('');
    let username = searchParams.get('name') ? searchParams.get('name') : '';
    let email = searchParams.get('email') ? searchParams.get('email') : '';
    let phone_number = searchParams.get('phone_number') ? searchParams.get('phone_number').replace(0,'') : '';
    let id_card_number = '';
    let status_checked = false;
    const [gender,setGender] = useState(1);
    
    const [order_id , setOrderId] = useState('');
    const [transaction_id, setTransactionId] = useState('');

    const [productId, setProductId] =  useState(0);
    
    let totalPriceAll = 0;
    let totalTicket = 0;
    //On click ticket click
    const [complimentaries, setComplimentaries]= useState([]);

    const HandleChangeGender = (event) =>{
        setGender(2);
    }
    
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
        //Action Loading;
        // setClickButtonBuy(true);
      
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
                getLocalStorage['ip_address'] =  ip;
                // Menit yang diperlukan untuk memilih metode pembayaran;
                getLocalStorage['expired_method_payment'] = 60 ;
                getLocalStorage['order_id'] = ress.results.order_id;  
                //ID Passing URL
                getLocalStorage['id'] = productId ;

                if(getLocalStorage.ticket_more_than_one_person === '0'){
                    getLocalStorage['user_data_guest'] = [{
                        'name': username,
                        'phone': '62'+ phone_number,
                        'email': email,
                        'id_card_number': id_card_number,
                        'gender': parseInt(gender),
                    }]
                    localStorage.setItem("data-ticket",JSON.stringify(getLocalStorage));
                }

                localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));
    
                if (ress.results.queue_number === 1) {
                    setQueueNumber(ress.results.queue_number);
                    setOrderId(ress.results.order_id);
                } else {
                    setQueueNumber(ress.results.queue_number);
                    setOrderId(ress.results.order_id);
                }
            } else {
                setClickButtonBuy(false);
                let error_message = ress.errors;
                setTimeout(() => {
                    Object.keys(error_message).forEach((value,key) => {
                        if(getLocalStorage.ticket_more_than_one_person === '1') {
                            for (let index = 0; index < getLocalStorage.total_ticket    ; index++) {
                                let error_messagee = document.getElementById(value +'_err_'+index);
                                if(error_messagee) {
                                    error_messagee.innerHTML = error_message[value][0];
                                } 
                            }
                        } else {
                            let error_messagee = document.getElementById(value);
                            if(error_messagee) {
                                error_messagee.innerHTML = error_message[value][0];
                            } 
                        }
                    });    
                }, 200);

            }
        }).catch((err) => {
            console.log(err);
        })
    }

    function TicketOneMorePerson(){ 
        const formDataUser = document.getElementById('formDataUser');
        const error_text = document.querySelectorAll('.error-text');
        for (let index = 0; index < error_text.length; index++) {
            error_text[index].textContent = '';
        }
        let formdata = new FormData(formDataUser);
        formdata.append('gender', gender);
        formdata.append('phone_number', '62'+ phone_number);
        formdata.append('term_and_condition', status_checked);
        formdata.append('uuid', uuid);
        formdata.append('ip_address', ip)

        Object.keys(getLocalStorage.fields).forEach(function (value,key) {
            formdata.append(value, getLocalStorage.fields[value]); 
        });
        CallAPIChcekout(formdata);
    }

    const SubmitTicket = (e) => {
        setClickButtonBuy(true);
        e.preventDefault();
         // Jika Jenis tike merupakan ticket_more_than_one_person
        if (getLocalStorage.ticket_more_than_one_person === '1') {
        
            let formdata = new FormData();
            let user = [];
            for (let index = 0; index < getLocalStorage.total_ticket; index++) {
                user.push({
                    'name' : document.getElementById(`name_${index}`).value,
                    'id_card_number' : document.getElementById(`id_card_number_${index}`).value,
                    'phone' : '62' + document.getElementById(`phone_number_${index}`).value,
                    'email' : document.getElementById(`email_${index}`).value,
                    'gender' : parseInt(document.getElementById(`gender_${index}`).options[document.getElementById(`gender_${index}`).selectedIndex].value),
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

                localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));

            }
            
            formdata.append('uuid', uuid);
            formdata.append('term_and_condition', status_checked);
            formdata.append('ip_address', ip);
            Object.keys(getLocalStorage.fields).forEach(function (value,key) {
                formdata.append(value, getLocalStorage.fields[value]); 
            });

            CallAPIChcekout(formdata);
       
        } else {
            TicketOneMorePerson();
        }
    }
    
    const CheckboxItem = () => {
        const [ischecked, setIschecked] = useState(false);
        const checkHandler = () => {
            if(ischecked === false) {
                setIschecked(true);
                status_checked = 1;
            } else {
                setIschecked(false);
                status_checked = 0;
            }
        }

        return (
            <div>
                <div className="flex items-center mb-6">
                    <div className="flex items-center ">
                        <label htmlFor="term_and_condition">
                            <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300  dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" value={ischecked === false ? false : true } name="term_and_condition"
                            onChange={checkHandler} />
                        </label>
                    </div>
                    <label className="ms-2 text-sm font-medium text-gray-900 mt-2">Saya setuju dengan <Link to="#" className="text-red-600 hover:underline">Syarat & Ketentuan </Link> yang berlaku di tiket.soulofjakarta.id *
                    </label>
                </div>
                <p className="text-red-600 error-text" id="term_and_condition"></p>
                <p className="text-red-600 error-text" id="term_and_condition_err_0"></p>
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
                                <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Masukan Nama"  id={`name_${index}`}/>
                                <p className="text-red-600 error-text" id={`name_err_${index}`}></p>
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 text-sm font-medium text-gray-900">NIK*</label>
                                <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="1884 - 8819 - 9881 - 1121" id={`id_card_number_${index}`}/>
                                <p className="text-red-600 error-text" id={`id_card_number_err_${index}`}></p>
                            </div> 
                            <div className="mb-6">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Nomor Ponsel*</label>
                            <div className="flex gap-4 text-center place-content-center align-content-center justify-center">
                                    <span className="font-semibold flex place-content-center align-content-center m-auto">+62</span>
                                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " id={`phone_number_${index}`} placeholder="881-****-****" />
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

    const TicketMoreThanOneMorePerson = () => {
        return (
            <form id="FormDataUserOneMorePreson" className={`${getLocalStorage.ticket_more_than_one_person === '1' ? 'block' : 'hidden'}`}> 

            {<InputForm/>}           
                            
            </form> 
        )
    }

    function WebsocketTest() {
        const getLocalStorage =  JSON.parse(localStorage.getItem('data-ticket')); 
        var websocket = new WebSocket("wss://websocket.soulofjakarta.id:8090");
        websocket.onopen = (event) => { };

        websocket.onmessage = (event) => {
            var Data = JSON.parse(event.data);
            // Jika queue update 
            if (typeof Data.queue !== "undefined") {
                setClickButtonBuy(false);
                if (Data.free === true) {
                    window.location.href = '/success';
                } else {
                    if (Data.queue === 0) {
                        // Jika total tiket yang di beli lebih besar dari 0 rupiah
                        if (getLocalStorage.total_price > 0) {
                            if (transaction_id) {
                                window.location.href = `${nextPage}?orderid=${document.getElementById('order_id').value}&transaction_id=${transaction_id}`;
                            } else {
                                window.location.href = `${nextPage}?orderid=${document.getElementById('order_id').value}`;
                            }
                        } else {
                            window.location.href = '/succes';
                        }
                    } else {
                        setQueueNumber(Data.queue);
                        setClickButtonBuy(false);
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
                    userId: uuid,
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
        WebsocketTest();
        if(EventParsUrl !== null) {
            function CallAPIDetailEvent() {
                CallApi(`event-dashboard/view/${EventParsUrl}`,{
                    method : 'GET',
                    headers: {
                        'x-client-token': GetKey,
                        'Accept': 'application/json'
                    }
                })
                .then(res => {
                    if(res.success === true) {
                        console.log(res);
                        let additional_cost_ = (parseInt(searchParams.get('price')) * parseFloat(res.results.additional_cost) / 100);
                        let total_price = parseInt(searchParams.get('price')) + additional_cost_;
                        let tax_cost = parseInt((total_price * res.results.tax) / 100) ;
                        let totalPriceAlls = total_price + tax_cost;
                        let DataLocalStorage = {
                            'id' : searchParams.get('id'),
                            'id_event' : EventParsUrl ,
                            'title' : res.results.name,
                            'start_time' : res.results.start_time,
                            'start_date' : res.results.start_date,
                            'end_date' : res.results.start_date,
                            'end_time' : res.results.end_time,
                            'city' : res.results.city,
                            'image' : res.results.main_img,
                            'total_price' : parseInt(searchParams.get('price')),
                            'total_price_all' : totalPriceAlls,
                            'total_ticket' : totalTicket,
                            'place' : res.results.venue,
                            //Biaya Layanan = ( totalPriceAll * additional_cost) /100
                            'additional_cost_' : additional_cost_,
                            //Biaya Tax = ( totalPriceAll * ppn ) / 100
                            'tax' : res.results.tax,
                            'tax_cost' : tax_cost,
                            // Validasi apakah dia dari page detail
                            // Jika iya maka nilai true\
                            'fromDetailPage' : false,
                            'complimentaries' : res.results.complimentaries,
                            'ticket' :[],
                            'fields' : {},
                            'ticket_more_than_one_person' : res.results.ticket_more_than_one_person === true ? '1' : '0' ,
                        }
        
                        res.results.tickets.forEach((value,keys) => {
                            if(parseInt(searchParams.get('ticket')) === value.id){
                                console.log(res.results.tickets[keys])
                                DataLocalStorage['ticket'].push({
                                    'name': res.results.tickets[keys].name,
                                    'value': 1,
                                    'id': res.results.tickets[keys].id,
                                    'price' : res.results.tickets[keys].price_value,
                                    'complimentari' : res.results.tickets[keys].complimentaries,
                                    'code' : res.results.tickets[keys].code,
                                });

                                DataLocalStorage['fields']['qty_' + searchParams.get('ticket')] = 1;

                                localStorage.setItem('data-ticket' , JSON.stringify(DataLocalStorage));
                            }
                        });

                        localStorage.setItem('data-ticket' , JSON.stringify(DataLocalStorage));
                    }
                    else {
                        console.log(res);
                    }
                }).catch((err) => {
                    console.log(err);
                } );
            }
            CallAPIDetailEvent();
        } 
        if(queue_number > 1) {
            setClickButtonBuy(false);
        }
    }, [WebsocketTest]);
    
    function CheckoutPage() {
        return (
            <div className="overflow-y-hidden">
                <div className="relative">
                    <ModalQueeing queue={queue_number} />
                    <div className="container mx-auto overflow-y-hidden">
                        <div className="grid grid-cols-6 gap-6 mx-5 inset-1 relative overflow-y-hidden max-md:grid-cols-1 max-md:gap-0">
                            <div className="col-span-4 ">
                                <div className="">
                                    <h1 className="font-semibold text-xl my-9 max-md:my-5">Detail Pemesanan</h1>
                                    <div className="space-y-3 bg-white border border-gray-200 rounded-lg shadow md:flex-row px-3 py-4">

                                        <div className="xl:grid grid-cols-2 space-y-2">
                                            <div className="w-full h-full">
                                                <img className="object-cover rounded-t-lg  md:h-auto md:rounded-none md:rounded-s-lg" src={getLocalStorage.image} alt="" />
                                            </div>
                                            <div className="justify-between p-4 max-md:p-0 leading-normal">
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

                                        <div className="space-y-2 bg-gray-50 ">
                                            <div className="grid grid-cols-3 max-md:mt-5 bg-gray-200 px-2">
                                                <span className="font-semibold text-lg max-md:text-base">Jenis Tiket</span>
                                                <span className="font-semibold text-lg max-md:text-base">Harga</span>
                                                <span className="font-semibold text-lg max-md:text-base">Jumlah</span>
                                            </div>
                                            {getLocalStorage.ticket.map((value, key) => (
                                                <div className="grid grid-cols-3 px-2" key={key}>
                                                    <span className="text-lg max-md:text-base">{value.name}</span>
                                                    <span className="text-lg max-md:text-base">{new Intl.NumberFormat().format(value.price)}</span>
                                                    <span className="text-lg max-md:text-base">X {value.value}</span>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                                <div className="">
                                    <h1 className="font-semibold text-xl my-9 max-md:my-5">Detail Pemesan</h1>
                                    <div className="space-y-3 bg-white border border-gray-200 rounded-lg shadow md:flex-row px-5 py-5">
                                        <input type="hidden" id="order_id" value={order_id} />
                                        <input type="hidden" id="uuid" value={uuidv4()} />
                                        {/* <TicketOneMorePerson/> */}
                                        <div>
                                            <form id="formDataUser" className={`${getLocalStorage.ticket_more_than_one_person === '0' ? 'block' : 'hidden'}`}>
                                                <div className="mb-6">
                                                    <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="name-1">Nama Lengkap*</label>
                                                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" id="name-1 " name="name" placeholder="Masukan Nama" onChange={event => username = event.target.value} defaultValue={username} />
                                                    <p className="text-red-600 error-text" id="name"></p>
                                                </div>
                                                <div className="mb-6">
                                                    <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="nik-1">NIK*</label>
                                                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="1884 - 8819 - 9881 - 1121" required name="id_card_number" defaultValue={id_card_number} id="nik-1" onChange={event => id_card_number = event.target.value} />
                                                    <p className="text-red-600 error-text" id="id_card_number"></p>
                                                </div>
                                                <div className="mb-6">
                                                    <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="phone_number">Nomor Ponsel*</label>
                                                    <div className="flex gap-4 text-center place-content-center align-content-center justify-center">
                                                        <span className="font-semibold flex place-content-center align-content-center m-auto">+62</span>
                                                        <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="881-****-****" defaultValue={phone_number} onChange={event => phone_number = event.target.value} />
                                                    </div>
                                                    <p className="text-red-600 error-text" id="phone_number"></p>
                                                </div>
                                                <div className="mb-6">
                                                    <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                                    <input type="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Alamat Email" name="email" defaultValue={email} onChange={event => email = event.target.value} />
                                                    <p className="text-red-600 error-text" id="email"></p>
                                                </div>
                                                <div className="mb-6">
                                                    <label className="block mb-2 text-sm font-medium text-gray-900">Gender</label>
                                                    <select id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " onChange={HandleChangeGender}>
                                                        <option value="1">Pria</option>
                                                        <option value="2">Wanta</option>
                                                    </select>
                                                    <p className="text-red-600 error-text" id="gender"></p>
                                                </div>

                                            </form>
                                        </div>
                                        <TicketMoreThanOneMorePerson />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-2 mt-16 start-4 space-y-5 max-md:mt-5">
                                <div className="shadow p-5 space-y-3 rounded-lg border">
                                    <div className="gap-5">
                                        <h1 className="font-semibold">Detail Harga</h1>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <p>Total Harga Tiket</p>
                                            <div className="flex gap-3">
                                                <p>IDR</p>
                                                <p>{new Intl.NumberFormat().format(getLocalStorage.total_price)}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <p>Biaya Layanan</p>
                                            <div className="flex gap-3">
                                                <p>IDR</p>
                                                <p>{new Intl.NumberFormat().format(getLocalStorage.additional_cost_)}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <p>Biaya Tax</p>
                                            <div className="flex gap-3">
                                                <p>IDR</p>
                                                <p>{new Intl.NumberFormat().format(getLocalStorage.tax_cost)}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between font-semibold">
                                            <p>Total Bayar</p>
                                            <div className="flex gap-3 font-semibold">
                                                <p>IDR</p>
                                                <p>{new Intl.NumberFormat().format(getLocalStorage.total_price_all)}</p>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">Harga</p>
                                        <div className="flex gap-3 font-semibold">
                                            <p>IDR</p>
                                            <p> {new Intl.NumberFormat().format(getLocalStorage.total_price_all)}</p>
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
                                        <img src="https://t.soulofjakarta.id/images/PREMIUM-BANNER-v3.jpg" alt="" />
                                    </picture>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
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