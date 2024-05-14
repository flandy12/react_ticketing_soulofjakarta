import { useEffect, useState } from "react";
import LayoutPageDashboard from "../layout";
import { CallApi, GetKey } from "../../../helper/Api";

const TransActionPage = () => {
  const userData = JSON.parse(localStorage.getItem("user_data"));
  const [dataTransaction, setDataTransaction] = useState([]);
  const [promotor_event, setPromotorEvent] = useState([]);
  const [menuFilter, setMenuFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(dataTransaction.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = dataTransaction.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const setPage = page => {
    console.log(page);
    setCurrentPage(page);
  };

  const HandleFilter = () => {
    menuFilter ? setMenuFilter(false) : setMenuFilter(true);
  };

  const HandleFilterSync = () => {
    CallApi("v1/report/ticket/revenue/generate", {
      method: "POST",
      headers: {
        "x-client-token": GetKey,
        Accept: "application/json",
        Authorization: `Bearer ${userData.token}`
      }
    }).then(response => {
      if (response.success === true) {
        setDataTransaction({});
        // CallApiRevenue();
        console.log(response);
      } else {
        alert("Error Ticket Revenue ! " + response.message);
        window.location.reload();
      }
    });
  };

  const CloseIcon = () => {
    menuFilter ? setMenuFilter(false) : setMenuFilter(true);
  };

  const CallEventPromotor = async () => {
    //Show Event Promotor
    await CallApi(`v1/event/${userData.user.promotor.id}`, {
      method: "POST",
      headers: {
        "x-client-token": GetKey,
        Accept: "application/json",
        Authorization: `Bearer ${userData.token}`
      }
    }).then(ress => {
      if (ress.success === true) {
        setPromotorEvent(ress.results.original.data);
      }
    });
  };

  const HandleFilterSubmit = () => {
    setDataTransaction([]);
    setMenuFilter(false);
    const dataRevenue = new FormData();
    dataRevenue.append(
      "start_date",
      document.getElementById("start_date").value
    );
    dataRevenue.append("end_date", document.getElementById("end_date").value);
    dataRevenue.append('event', document.getElementById('promotor_event').value);
    CallApiTransaction(dataRevenue);
  };

  const renderPagination = () => {
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = startPage + maxPages - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    if(dataTransaction.length > 10) {
      return (
        <div className="flex gap-5 bg-slate-100 text-center mx-auto justify-center">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
          <button
            key={startPage + i}
            onClick={() => setPage(startPage + i)}
            disabled={currentPage === startPage + i}
            className={`${
              currentPage === startPage + i
                ? "bg-amber-300 px-4 py-2 font-semibold"
                : ""
            }`}>
            {startPage + i}
          </button>
        ))}
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    );
    }
    
  };

  const CallApiTransaction = params => {
    CallApi("v1/report/ticket/daily-transaction", {
      method: "POST",
      headers: {
        "x-client-token": GetKey,
        Accept: "application/json",
        Authorization: `Bearer ${userData.token}`
      },
      body: params
    }).then(response => {
      if (response.success === true) {
        setDataTransaction(response.results);
      } else {
        alert("Error Ticket Revenue ! " + response.message);
        window.location.reload();
      }
    });
  };

  useEffect(() => {
    CallEventPromotor();
    CallApiTransaction();
  }, []);

  return (
    <LayoutPageDashboard>
      <div className="p-5 space-y-5">
        <div className="flex justify-between">
          <div className="flex justify-between">
            <button onClick={HandleFilter}>
              <img src="/images/icon/filter.svg" alt="filter" />
            </button>
            
            <form className="max-w-md mx-auto">   
                <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 " placeholder="Search Mockups, Logos..." required />
                    <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 ">Search</button>
                </div>
            </form>
          </div>

          <div
            id="filter-transaction-box"
            className={`${
              menuFilter ? "" : "hidden"
            } active absolute z-50 bg-slate-50 px-4 py-5 rounded shadow-md top-16`}>
            <div className={`flex justify-between mb-2`}>
              <button
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-red-100 inline-flex items-center justify-center h-8 w-8 "
                onClick={CloseIcon}
                data-dismiss-target="#toast-success"
                aria-label="Close">
                <span className="sr-only">Close</span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  onClick={CloseIcon}
                  viewBox="0 0 14 14">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-5" id="filter-revenue">
              <div className="flex justify-between gap-4 ">
                <div className="block w-full">
                  <div className="mb-2">Tanggal Mulai</div>
                  <input
                    type="date"
                    className="px-5 py-2 rounded w-full"
                    name="start_date"
                    id="start_date"
                  />
                </div>
                <div className="block  w-full">
                  <div className="mb-2">Tanggal Berakhir</div>
                  <input
                    type="date"
                    className="px-5 py-2 rounded w-full"
                    name="end_date"
                    id="end_date"
                  />
                </div>
              </div>
              <div className="block">
                <div className="mb-2">Pilih Event</div>
                <select id="promotor_event" className="py-2 px-3" name="promotor_event">
                    {promotor_event.map((element,key) => (
                        <option value={element.name} className="" key={key}>{element.name}</option>
                    ))}
                </select>
              </div>
              <div className="flex justify-content-between gap-2">
                <button
                  className="bg-amber-300 px-10 py-2 rounded-lg"
                  id="submit_revenue"
                  onClick={HandleFilterSubmit}>
                  Cari
                </button>
                <button
                  className="px-10 py-2 rounded-lg border bg-slate-50"
                  id="resset-filter">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative overflow-y-scroll h-[510px] bg-slate-50">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-slate-200">
            <thead className="text-xs text-gray-700 uppercase ">
              <tr className="text-base">
                <th scope="col" className="px-6 py-3">
                  EVENT
                </th>
                <th scope="col" className="px-6 py-3">
                  TIPE PEMBAYARAN
                </th>
                <th scope="col" className="px-6 py-3">
                  TANGGAL & WAKTU
                </th>
                <th scope="col" className="px-6 py-3">
                  ID PESANAN
                </th>
                <th scope="col" className="px-6 py-3">
                  JUMLAH
                </th>
                <th scope="col" className="px-6 py-3">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-50">
              {currentItems
                .filter(val => val.transaction_status === "settlement")
                .map((value, key) => (
                  <tr className="border-b " key={key}>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {value.event_name}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {value.payment_type}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {value.transaction_time}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {value.order_id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      Rp.{value.gross_amount}
                    </td>
                    <td
                      className={`px-6 capitalize  py-4 font-medium text-gray-900 whitespace-nowrap ${
                        value.transaction_status === "settlement"
                          ? "bg-green-400"
                          : ""
                      }`}>
                      {value.transaction_status}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {renderPagination()}
      </div>
    </LayoutPageDashboard>
  );
};

export default TransActionPage;
