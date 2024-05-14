
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CallApi, GetKey } from "../../helper/Api";

const Navbar = () => {
    const getUrl = window.location.pathname.split('/')[1];
    const UserLogin = JSON.parse(localStorage.getItem('user_data'));
    const [isActive, setIsActive] = useState(false);
    const [login, setLogin] = useState(false);
    const [user, setUser] = useState('user');

    const MenuProfile = () => {
        if(isActive) {
            setIsActive(false);
        } else {
            setIsActive(true);
        }
    }

    const Logout = () => {
        const  userData = localStorage.removeItem("user_data");
        localStorage.removeItem(userData);
        setLogin(true);
        setIsActive(false);
    }

    const SwitchRoleUser = () => {
        CallApi('v1/switch/to/promoter', {
            method: 'POST',
            headers: {
                'x-client-token': GetKey,
                'Accept': 'application/json',
                'Authorization': `Bearer ${UserLogin.token}`
            },
        })
        .then(ress => {
            if (ress.success === true) {
                // Jika Role nya promoter
                
                if (UserLogin.promotor === true && UserLogin) {
                    console.log(ress);
                    UserLogin['promotor'] = false;
                    localStorage.setItem('user_data', JSON.stringify(UserLogin));
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                    
                } else {
                    UserLogin['promotor'] = true;
                    localStorage.setItem('user_data', JSON.stringify(UserLogin));
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                }
            } else {
                alert(ress.message);
            }
        })
    }
    
    useEffect(() => {
    }, [isActive,login]);

    return (
    <div className=" sticky top-0 z-50">
        <nav className="bg-black sticky top-0 z-50 ">
            <div className="flex flex-wrap justify-between items-center mx-auto p-4 max-md:justify-between container w-full">
                
                <div className="flex justify-between  ">
                    <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="/images/icon/logo.svg" className="h-8" alt="Logo" />
                    </Link>
                    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                        </svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto  ms-8" id="navbar-default">
                        <ul className="font-medium flex flex-col justify-between max-md:justify-between p-4 md:p-0 mt-4 border rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 text-gray-400 opacity-90">
                            <li>
                        <Link to="/" className={`block py-2 px-3 bg-blue-700 rounded ${getUrl === '' ? 'text-amber-300' : ''} bg-transparent md:p-0`} aria-current="page" >Home</Link>
                            </li>
                            <li>
                        <Link to="/dashboard" className={`block py-2 px-3 bg-blue-700 rounded ${getUrl === 'Tiket Saya' ? 'text-amber-300' : ''} bg-transparent md:p-0`}>{UserLogin.promotor ? 'Event Saya' : 'Tiket Saya'}</Link>
                            </li>
                            <li>
                        <Link to="/media-partner" className={`block py-2 px-3 bg-blue-700 rounded ${getUrl === 'media-partnerr' ? 'text-amber-300' : ''} bg-transparent md:p-0`}>Media Partner</Link>
                            </li>
                            <li>
                        <Link to="/give-away" className={`block py-2 px-3 bg-blue-700 rounded ${getUrl === 'give-away' ? 'text-amber-300' : ''} bg-transparent md:p-0`}>Give Away</Link>
                            </li>
                        
                        
                        </ul>
                    
                    </div>

                    
                </div>
                <div className=" px-4 py-2 ">
                    {UserLogin ? (<button className="font-semibold rounded text-black bg-amber-300 px-4 py-2" onClick={MenuProfile}>{UserLogin ? UserLogin.user.name : ''}</button>): 

                    <div className="space-x-2 ">
                        <button className="font-semibold px-4 py-2 rounded border border-amber-300 text-amber-300">
                        <Link to={'/login'}> Masuk </Link>
                        </button>
                        <button className="font-semibold px-4 py-2 rounded border border-amber-300 text-black bg-amber-300">
                            <Link to={'/register'}>Daftar</Link>
                        </button>
                    </div>
                    }
                    
                </div>
            </div>
        
        </nav>
        {UserLogin ? (
             <div className={`absolute z-40 w-full h-screen bg-black-opacity   ${!isActive ?'hidden' : ''}`}>
             <div className="absolute h-fit w-[220px] bg-white right-10 mt-5 p-5 rounded">
                 <ul className="flex flex-col space-y-2">
                     <li>
                     <strong className="block text-xs font-medium uppercase text-gray-400"> General </strong>
 
                     <ul className="mt-2 space-y-1">
                         <li>
                         <a
                             href="#"
                             className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                         >
                             Profile
                         </a>
                         </li>
                         
                     </ul>
                     </li>
 
                     <li>
                     <strong className="block text-xs font-medium uppercase text-gray-400"> Support </strong>
 
                     <ul className="mt-2 space-y-1">
                         <li>
                         <a
                             href="#"
                             className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                         >
                             Settings
                         </a>
                         </li>
                     </ul>
                     </li>
 
                     <li>
                     <strong className="block text-xs font-medium uppercase text-gray-400"> Profile </strong>
 
                     <ul className="mt-2 space-y-1">
                         <li>
                         <span
                           
                             className="cursor-pointer  block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                             onClick={SwitchRoleUser}
                         >
                             Beralih Ke {UserLogin.promotor && UserLogin.promotor === true ? 'Pembeli' : 'Promotor'}
                         </span>
                         </li>
 
                     
 
                         <li>
               
                         <button
                         className="block w-full rounded-lg px-4 py-2 text-sm font-medium text-red-500 [text-align:_inherit] hover:bg-gray-100 hover:text-gray-700"
                         onClick={Logout}
                         >
                         Logout
                         </button>
                   
                         </li>
                     </ul>
                     </li>
                 </ul>
             </div>
            </div>
        ) : ''}
    </div>
    )
}

export default Navbar;