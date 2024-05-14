import { useEffect, useState } from "react";
import { CallApi, GetKey } from "../../../helper/Api";
import LayoutPageDashboard from "../layout";

const RevenuePage = () => {
  const userData = JSON.parse(localStorage.getItem("user_data"));
  const [dataRevenue, setDataRevenue] = useState({});
  const [menuFilter, setMenuFilter] = useState(false);

  const CallApiRevenue = (params) => {
    CallApi("v1/report/ticket/revenue", {
      method: "POST",
      headers: {
        "x-client-token": GetKey,
        Accept: "application/json",
        Authorization: `Bearer ${userData.token}`
      },
      body : params
    }).then(response => {
      if (response.success === true) {
        console.log(response);
        const data_result = response.results[0];
        Object.values(data_result).map(val => setDataRevenue(val));
      } else {
        alert("Error Ticket Revenue ! " + response.message);
        window.location.reload();
      }
    });
  };

  const CloseIcon = () => {
    menuFilter ? setMenuFilter(false) : setMenuFilter(true);
  }

  const HandleFilter = () => {
    menuFilter ? setMenuFilter(false) : setMenuFilter(true);
  }

  const HandleFilterSubmit = () => {
    setDataRevenue({});
    setMenuFilter(false);
    const dataRevenue = new FormData();
    dataRevenue.append('start_date', document.getElementById('start_date').value)
    dataRevenue.append('end_date', document.getElementById('end_date').value)
    CallApiRevenue(dataRevenue);
  }

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
        setDataRevenue({});
        CallApiRevenue();
        console.log(response);
      } else {
        alert("Error Ticket Revenue ! " + response.message);
        window.location.reload();
      }
    });
  }

  useEffect(() => {
    CallApiRevenue();
  }, []);

  return (
    <LayoutPageDashboard>
      <div className="p-5 space-y-5">
        <div className="flex justify-between">
          <button onClick={ HandleFilter }>
             <img src="/images/icon/filter.svg" alt="filter" />
          </button>
          <button className="bg-amber-300 px-6 py-2 rounded-full font-semibold" onClick={HandleFilterSync}>
            SINKRONKAN HARI INI
          </button>

          <div
            id="filter-transaction-box"
            className={`${menuFilter ? '' : 'hidden'} active absolute z-50 bg-slate-50 px-4 py-5 rounded shadow-md top-16`} >
            <div className={`flex justify-between mb-2`}>
              <button
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-red-100 inline-flex items-center justify-center h-8 w-8 "
                onClick={ CloseIcon }
                data-dismiss-target="#toast-success"
                aria-label="Close" >
                <span className="sr-only">Close</span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  onClick={ CloseIcon }
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
              <div className="flex gap-4 ">
                <div className="block">
                  <div className="mb-2">Tanggal Mulai</div>
                  <input
                    type="date"
                    className="px-5 py-2 rounded"
                    name="start_date"
                    id="start_date"
                  />
                </div>
                <div className="block">
                  <div className="mb-2">Tanggal Berakhir</div>
                  <input
                    type="date"
                    className="px-5 py-2 rounded"
                    name="end_date"
                    id="end_date"
                  />
                </div>
              </div>
              <div className="flex justify-content-between gap-2">
                <button
                  className="bg-amber-300 px-10 py-2 rounded-lg"
                  id="submit_revenue"
                  onClick={ HandleFilterSubmit }>
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
                <th className="px-6 py-3">
                  EVENT
                </th>
                <th className="px-6 py-3">
                  AGREEMENT %
                </th>
                <th className="px-6 py-3">
                  TIKET
                </th>
                <th className="px-6 py-3">
                  HARGA
                </th>
                <th className="px-6 py-3">
                  JUMLAH
                </th>
                <th className="px-6 py-3">
                  PPN
                </th>
                <th className="px-6 py-3">
                  PENGHASILAN
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-50">
              {Object.entries(dataRevenue).map((value, key) => (
                <tr className="border-b " key={key}>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {value[0]}
                  </td>

                  {Object.values(value[1]).map((val,keys) => (
                    <>
                      <td className="px-6 py-4 text-gray-900" key={keys}>
                        {new Intl.NumberFormat().format(
                          val.agreement_percentage
                        )}{" "}
                        %
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {new Intl.NumberFormat().format(val.price)}
                      </td>
                      <td className="px-6 py-4 text-gray-900">{val.qty}</td>
                      <td className="px-6 py-4 text-gray-900">
                        {new Intl.NumberFormat().format(val.ppn_price)}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {new Intl.NumberFormat().format(val.promoter_value)}
                      </td>
                    </>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutPageDashboard>
  );
};

export default RevenuePage;
