import { Link } from "react-router-dom";

const PageCheckout = () => {
    const getLocalStorage =  JSON.parse(localStorage.getItem('data-user')); 


    return (
        
        <div className="container mx-auto">
            <div className="grid grid-cols-5 gap-3 ">
            <div className="col-span-3 ">
                <div className="">
                    <h1 className="font-semibold text-xl my-9">Detail Pemesanan</h1>
                    <div className="space-y-3 bg-white border border-gray-200 rounded-lg shadow md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 py-2">
                            
                        <div class="flex items-center">
                            <div className="col-6 w-64 h-full">
                               <img class="object-cover rounded-t-lg  md:h-auto md:rounded-none md:rounded-s-lg" src={getLocalStorage.image} alt="" />
                            </div>
                            <div class="col-6 justify-between p-4 leading-normal">
                                <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {getLocalStorage.title}
                                </h5>
                                
                                <div className="space-y-2 mt-2"> 
                                    <p className="font-normal">Dates : {getLocalStorage.start_date} {getLocalStorage.end_date ? `- ${getLocalStorage.end_date}` : ''}</p>
                                    <p className="font-normal">Time : {getLocalStorage.start_time} {getLocalStorage.end_time ? `- ${getLocalStorage.end_time}` : ''}  WIB</p>
                                    <p className="font-normal">City : {getLocalStorage.city}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-col-5">
                            <table>
                                <tr> 
                                    <td className="font-semibold">Jenis Tiket</td>
                                    <td className="font-semibold">Harga</td>
                                    <td className="font-semibold">Jumlah</td>
                                </tr>
                                <tr> 
                                    <td>
                                        <div className="flex gap-2">
                                            <div>isacsa</div>
                                            <p>Premium</p>
                                        </div>
                                    </td>
                                    <td>2,500,000</td>
                                    <td>X 1</td>
                                </tr>
                            </table>
                        </div>

                    </div>
                </div>
                <div className="">
                    <h1 className="font-semibold text-xl my-9">Detail Pemesan</h1>
                    <div className="space-y-3 bg-white border border-gray-200 rounded-lg shadow md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 py-2">
                            
                    <form>
                       
                        <div class="mb-6">
                            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Lengkap*</label>
                            <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
                        </div>
                            
                           
                        <div class="mb-6">
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">NIK*</label>
                            <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
                        
                        </div> 
                        <div class="mb-6">
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nomor Ponsel*</label>
                            <input type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
                        </div> 
                        <div class="mb-6">
                            <label for="confirm_password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" required/>
                        </div> 
                        <div class="flex items-start mb-6">
                            <div class="flex items-center h-5">
                            <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required/>
                            </div>
                            <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" class="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a>.</label>
                        </div>
                        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </form>


                    </div>
                </div>
            </div>
            <div className="col-span-2 mx-4 start-4">
                <div className="shadow p-5 space-y-3 rounded-lg border">
                    <div className="flex gap-5">
                        <div>sacsa</div>
                        <p>icon_ticket Kamu belum memilih tiket. Silakan pilih lebih dulu di tab menu TIKET.</p>
                    </div>
                    <div> 
                        <p className="font-semibold">Masukan Kode Promo</p>

                        <div>
                            
                            <div class="relative mt-2 rounded-md shadow-sm">
                                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span class="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <input type="text" name="price" id="price" class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                                <div class="absolute inset-y-0 right-0 flex items-center">
                                <label for="currency" class="sr-only">Currency</label>
                                <select id="currency" name="currency" class="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                                    <option>USD</option>
                                    <option>CAD</option>
                                    <option>EUR</option>
                                </select>
                                </div>
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
                            <p> {new Intl.NumberFormat().format(getLocalStorage.total_price) }</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link to="/checkout">
                            <button className="bg-yellow-300 w-full p-2 rounded-md font-semibold">Beli</button>
                        </Link>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default PageCheckout;