import { CallApi, GetKey } from "../../../helper/Api";
import { useEffect, useState } from "react";
import Navbar from "../../compoments/navbar";
import LoadingAnimation from "../../compoments/loading";
import { CountdownTimerMethodPaymant } from "../../compoments/count_down";
import ServerError from "../../compoments/error/server_error";
import { useSearchParams } from "react-router-dom";


const PaymentMethod = () => {

    const [payment,setPayment] = useState([]);
    const getLocalStorage =  JSON.parse(localStorage.getItem('data-ticket')); 
    const [click, setClick] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [clearIntervalStatus, setClearIntervalStatus] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    
    const route_payment_method = '/payment';
  
    const route_checkout = '/checkout';
    const route_error = '/error';
    var click_count = 0;

    const [message, setMessage] = useState('');

    const API = () => {
        CallApi('payments',  {
            method: 'GET',
            headers: {
                'x-client-token': GetKey,
                'Accept': 'application/json',
            },
        }).then((ressponse) => {
            if(ressponse.success === true) {
                setPayment(ressponse.results.payments);
                setLoading(true);
                setMessage('Success')
            }else {
                setLoading(false);
                setMessage('API ERROR');
            }
        }).catch((err) => {
            setMessage('Server Error')
            console.log(err);
        })
    }

    const onCLickPayment = (e) => {
        // let click_count_value = click_count + 1;
        getLocalStorage['payment_type_id'] = e.target.getAttribute('data-id');
        getLocalStorage['payment_code'] = e.target.getAttribute('data-code');
        getLocalStorage['payment_method'] = e.target.getAttribute('data-id-name');
        getLocalStorage['payment_type'] = e.target.getAttribute('data-type');
        getLocalStorage['redirect_url_'] = e.target.getAttribute('data-redirect-url');
        getLocalStorage['information'] = e.target.getAttribute('data-information');
        getLocalStorage['payment_category'] = e.target.getAttribute('data-payment-category');
        getLocalStorage['expired'] = e.target.getAttribute('data-expired');
        getLocalStorage['logo'] = e.target.getAttribute('data-logo');
        localStorage.setItem("data-ticket", JSON.stringify(getLocalStorage));
        
        e.preventDefault();

        setClick(true);
        setClearIntervalStatus(true);

        console.log(e.target.getAttribute('data-type'),e.target.getAttribute('data-code'));
   
        // if (click_count_value === 1) {
        let formdata = new FormData();
        if(getLocalStorage.ticket_more_than_one_person === '1') {

            for (let index = 0; index < getLocalStorage.total_ticket; index++) {
        
                for (let count = 0; count < getLocalStorage.ticket.length; count++) {
                    formdata.append(`ticket_owner_name_${getLocalStorage.ticket[count].code}[]`, getLocalStorage.user_data_guest[count].name );
                    formdata.append(`ticket_owner_email_${getLocalStorage.ticket[count].code}[]`, getLocalStorage.user_data_guest[count].email );
                    formdata.append(`ticket_owner_id_card_number_${getLocalStorage.ticket[count].code}[]`, getLocalStorage.user_data_guest[count].id_card_number);
                    formdata.append(`ticket_owner_phone_number_${getLocalStorage.ticket[count].code}[]`, getLocalStorage.user_data_guest[count].phone);
                }

            }
            
            formdata.append('uuid', getLocalStorage.uuid);
            formdata.append('name', getLocalStorage.user_data_guest[0].name);    
            formdata.append('email', getLocalStorage.user_data_guest[0].email); 
            formdata.append('id_card_number', getLocalStorage.user_data_guest[0].id_card_number); 
            formdata.append('gender', getLocalStorage.user_data_guest[0].gender); 
            formdata.append(`phone_number`, getLocalStorage.user_data_guest[0].phone);
    
            Object.keys(getLocalStorage.fields).forEach(function (value,key) {
                formdata.append(value, getLocalStorage.fields[value]); 
            });

            formdata.append('order_id', getLocalStorage.order_id);
            formdata.append('payment_code', e.target.getAttribute('data-code'));
            formdata.append('payment_type_id', e.target.getAttribute('data-id'));
            
            BuyTicket(formdata);
        } else {
            formdata.append('uuid', getLocalStorage.uuid)
            formdata.append('name', getLocalStorage.user_data_guest.name)
            formdata.append('email', getLocalStorage.user_data_guest.email)
            formdata.append('id_card_number', getLocalStorage.user_data_guest.id_card_number)
            formdata.append('gender', parseInt(getLocalStorage.user_data_guest.gender))
            formdata.append('phone_number', getLocalStorage.user_data_guest.phone_number)
            formdata.append('order_id', getLocalStorage.order_id);
            formdata.append('payment_code', e.target.getAttribute('data-code'));
            formdata.append('payment_type_id', e.target.getAttribute('data-id'));
            Object.keys(getLocalStorage.fields).forEach(function (value,key) {
                formdata.append(value, getLocalStorage.fields[value]); 
            }); 
            
            BuyTicket(formdata);

        }
        // } else {
        //     setClick(true);
        //     setTimeout(() => {
        //         alert('Kamu Gagal Memesan Tiket');
        //         window.location.href = route_checkout;
        //     }, 1500);
        // }
    }

    const BuyTicket = (formdata) => {
        CallApi(`v1/buy-ticket/${getLocalStorage.id_event}`,  {
            method: 'POST',
            headers: {
                'x-client-token': GetKey,
                'Accept': 'application/json',
            },
            body: formdata
        }).then((ressponse) => {
            console.log(ressponse);
            if(ressponse.success === true) {
                console.log(ressponse);
                setClick(false);
                if (getLocalStorage.payment_type === 'credit_card') {
                    getLocalStorage['invoice_id'] = ressponse.results.invoice_id;
                    localStorage.setItem('category_ticket', JSON.stringify(getLocalStorage));
                    //Generate History 
                    window.location.href = route_payment_method + '?invoice=' + ressponse.results.invoice_id + '&&paymenttype=' + getLocalStorage.payment_category + '&generate=' + getLocalStorage.code_generate_history;
                } else {
                    getLocalStorage['invoice_id'] = ressponse.results.invoice_id;
                    getLocalStorage['code_generate_history'] = ressponse.results.code;
                    getLocalStorage['invoice_expired_at'] = ressponse.results.expired_at;
                    localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));

                    const formData = new FormData();
                    
                    if (getLocalStorage.ticket_more_than_one_person === '0') {
                        const getLocalStorage =  JSON.parse(localStorage.getItem('data-ticket')); 
                        formData.append('uuid', getLocalStorage.uuid);
                        formData.append('name', getLocalStorage.user_data_guest.name);
                        formData.append('id_card_number', getLocalStorage.user_data_guest.id_card_number);
                        formData.append('email', getLocalStorage.user_data_guest.email);
                        formData.append('phone_number', getLocalStorage.user_data_guest.phone_number);
                        formData.append('gender', parseInt(getLocalStorage.user_data_guest.gender));
                        formData.append('payment_type', getLocalStorage.payment_category);
                        formData.append('payment_code', getLocalStorage.payment_code);
                        formData.append('event', getLocalStorage.id_event);
                        formData.append('invoice', getLocalStorage.invoice_id);
                        formData.append('id', getLocalStorage.id);
                        formData.append('ip_address', getLocalStorage.ip_address);
                        Object.keys(getLocalStorage.fields).forEach(function (key) {
                            formData.append(`${key}`, parseInt(getLocalStorage.fields[key]));
                        });
                        CallApiPayment(formData);
                        
                    } else {
                        const getLocalStorage =  JSON.parse(localStorage.getItem('data-ticket')); 
                        formData.append('payment_type', getLocalStorage.payment_type);
                        formData.append('payment_code', getLocalStorage.payment_code);
                        formData.append('invoice', getLocalStorage.invoice_id);
                        formData.append('event', getLocalStorage.id);
    
                        formData.append('uuid', getLocalStorage.uuid);
                        formData.append(`ip_address`, getLocalStorage.ip_address);
                        formData.append(`name`, getLocalStorage.name);
                        formData.append(`email`, getLocalStorage.email);
                        formData.append(`gender`, parseInt(getLocalStorage.gender));
                        formData.append(`id_card_number`, parseInt(getLocalStorage.id_card_number));
                        formData.append(`phone_number`, parseInt(getLocalStorage.phone));
    
                        Object.keys(getLocalStorage.fields).forEach(function (value, key) {
                            let value_ticket_id = value.replace('qty_', '');
                            formData.append(value, getLocalStorage.fields[value]);
                            formData.append(`ticket_owner_name_${value_ticket_id}[]`, getLocalStorage.history_ticket[key].name);
                            formData.append(`ticket_owner_id_card_number_${value_ticket_id}[]`, getLocalStorage.history_ticket[key].id_card_number);
                            formData.append(`ticket_owner_email_${value_ticket_id}[]`, getLocalStorage.history_ticket[key].email);
                            formData.append(`ticket_owner_phone_number_${value_ticket_id}[]`, getLocalStorage.history_ticket[key].phone);
                        });
                        for (var pair of formdata.entries()) {
                            console.log(pair[0] + ": " + pair[1]);
                          }
                        // CallApiPayment(formData);
                    }
                }
            }else {
                setClick(false);
                console.log(ressponse);
            }
        })
    }

    const CallApiPayment = (form) => {
        CallApi(`v1/charge`, {
            method: 'POST',
            headers: {
                'x-client-token': GetKey,
                'Accept': 'application/json',
            },
            body: form,
        }).then((ressponse) => {
            console.log(ressponse);
            // panggil charge payment/
            if (ressponse.success === true && ressponse.results.result.status_code === "201") {
                
                switch (getLocalStorage['payment_category']) {
                    case 'bank_transfer':
                        //bca,bri,bni
                        let va = ressponse.results.result.va_numbers[0].va_number;
                        getLocalStorage['expired_at_payment'] = ressponse.results.result.expiry_time;
                        getLocalStorage['va_numbers'] = va;
                        localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));
                        break;
                    case 'permata':
                        //permata
                        let permata = ressponse.results.result.permata_va_number;
                        getLocalStorage['va_numbers'] = permata;
                        localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));
                        break;
                    case 'echannel':
                        // mandiri
                        let mandiri = ressponse.results.result.bill_key;
                        getLocalStorage['va_numbers'] = mandiri;
                        localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));
                        break;
                    case 'gopay':
                        // gopay
                        let gopay = ressponse.results.result.actions[1].url;
                        getLocalStorage['redirect_url'] = gopay;
                        localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));
                        break;
                    case 'shopeepay':
                        // shopeepay
                        let shopeepay = ressponse.results.result.actions[0].url;
                        getLocalStorage['redirect_url'] = shopeepay;
                        localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));
                        break;
                    case 'qris':
                        // qris
                        let qris = ressponse.results.result.actions[0].url;
                        getLocalStorage['redirect_url'] = qris;
                        localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));
                        break;
                    case 'bca_klikpay':
                        // bca_klikpay
                        let bca_klikpay = ressponse.results.result.redirect_url;
                        getLocalStorage['redirect_url'] = bca_klikpay;
                        localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));
                        break;
                    case 'cimb_clicks':
                        // cimb_clicks
                        let cimb_clicks = ressponse.results.result.redirect_url;
                        getLocalStorage['redirect_url'] = cimb_clicks;
                        localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));
                        break;
                    case 'cstore':
                        // indomaret
                        let indomaret = ressponse.results.result.payment_code;
                        getLocalStorage['va_numbers'] = indomaret;
                        localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));
                        break;
                    default:
                        console.log('no payment method');
                        break;
                }
                HistoryLocalStorage(getLocalStorage.code_generate_history);
                setTimeout(() => {
                    window.location.href = route_payment_method + '?invoice=' + getLocalStorage.invoice_id + '&&paymenttype=' + getLocalStorage.payment_type + '&generate=' + getLocalStorage.code_generate_history;

                }, 500);

            } else {
                console.log(ressponse);
                // Kondisi Dimana API Midtrans Error
                alert('Maaf Sedang Ada Kendala Sistem, Silahkan Coba Kembali');
                // PaymentCancel();
            };
         
        })
    }

    const HistoryLocalStorage = (history) => {
        const timeout_event = {
            'invoice_id': getLocalStorage.invoice_id,
            'invoice_expired_at': getLocalStorage.invoice_expired_at,
            'logo': getLocalStorage.logo,
            'redirect_url': getLocalStorage.redirect_url,
            'img_ticket': getLocalStorage.image,
            'information': getLocalStorage.information,
            'date': getLocalStorage.start_date + getLocalStorage.end_date === "" ? '' : '-' + getLocalStorage.end_date ,    
            'place': getLocalStorage.place,
            'time': getLocalStorage.start_time + getLocalStorage.end_time === '' ? '' : '-' + getLocalStorage.end_time,
            'price': getLocalStorage.total_price_all,
            'va_numbers': getLocalStorage.va_numbers,
            'name_event': getLocalStorage.title,
            'uuid': getLocalStorage.uuid,
            'payment_name': getLocalStorage.payment_method,
            'event': getLocalStorage.id_event,
            'payment_code': getLocalStorage.payment_code,
        };
        localStorage.setItem(history, JSON.stringify(timeout_event));
    }

    const CountdownTimerMethodPaymant = () => {
        const getLocalStorage =  JSON.parse(localStorage.getItem('data-ticket')); 
        const [timer, setTimer] = useState(getLocalStorage.expired_method_payment);
        const beforePage = '/checkout';
      
        useEffect(() => {
          const interval = setInterval(() => {
            setTimer(prevTimer => {
                if(clearIntervalStatus) {
                    clearInterval(interval);
                    return  prevTimer;
                } else {
                    if (prevTimer > 0) {
                        getLocalStorage['expired_method_payment'] = prevTimer - 1 ;
                        localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));
                        return prevTimer - 1;
                      } else {
                        clearInterval(interval); // Hentikan interval jika waktu sudah habis
                        getLocalStorage['expired_method_payment'] = 0 ;
                        localStorage.setItem('data-ticket', JSON.stringify(getLocalStorage));
                        window.location.href = beforePage;
                        return 0;
                      }
                }
            });
          }, 1000);
          
          return () => {
            clearInterval(interval)
          };
        }, [getLocalStorage,beforePage]);
        
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
      
        return (
          <div>
             <p className="text-center font-semibold text-red-500 text-lg"> Sisa Waktu</p>
            <p className="text-red-500 font-semibold text-center text-2xl">00 : {minutes < 10 ? '0' + minutes : minutes} : {seconds < 10 ? '0' + seconds : seconds}</p>
          </div>
        );
    };

    const PaymentPage = () => {
        return (
            <div className="container mx-auto">
                <div className=" p-6 w-max-[200px] bg-white border border-gray-200 rounded-lg shadow mx-auto">
                    <CountdownTimerMethodPaymant/>
                    <h1 className="my-5 text-2xl font-semibold tracking-tight text-black mb-5">Jenis Pembayaran</h1>
                    <div className="mx-0 gap-5 grid grid-cols-4">
                    
                        {payment.map((values,key) => (
                            <div key={key} className="rounded p-5 border">
                                <h1 className="uppercase font-semibold">{values.id_name}</h1>
                                <p className="text-slate-400 mt-5 text-sm">Pilih Metode Pembayaran</p>
                                <p className="uppercase font-semibold">metode pembayaran</p>
                                {
                                <div className={`space-y-5`}  key={key}>
                                        { values.payment_types.map((value,key) => (
                                            <div className={`bg-slate-100 py-4 my-5 border rounded-lg  mx-auto flex` } key={key} >
                                                <img src={value.logo} alt="payment-logo" className="mx-auto cursor-pointer" data-id={value.id} data-code={value.code} data-type={values.type} data-id-name={values.id_name} data-logo={value.logo} data-expired={value.expiry_minute}  data-redirect-url={value.redirect} data-payment-category={value.type}  data-information={value.information} onClick={onCLickPayment}  />
                                            </div>
                                        ))}
                                </div>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
    
    const renderSwitch = (param) => {
        switch(param) {
            case 'Success':
                return <PaymentPage/>;
            case 'API ERROR':
                return <ServerError/>;
            case 'Server Error':
                return <ServerError/>;
            default:
                return  '';
        }
    };


    useEffect(() => {
        API();  
      
    }, [])

    return (
        <>
            <LoadingAnimation click={click}/>
            <Navbar/>
            {
                getLocalStorage ? (
                    renderSwitch(message)
                ) : (renderSwitch(message))
            }
        </>
 
    )
}
export default PaymentMethod;