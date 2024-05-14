import { useEffect, useState } from "react";
import { CallApi, GetKey } from "../../../helper/Api";
import LayoutPageDashboard from "../layout";
import { Link } from "react-router-dom";

const ReferralCodePage = () => {
const userData = JSON.parse(localStorage.getItem("user_data"));
  const [dataReferral, setDataReferral] = useState([]);

  const CallApiRefferal = () => {
    CallApi("v1/referral-code", {
      method: "POST",
      headers: {
        "x-client-token": GetKey,
        Accept: "application/json",
        Authorization: `Bearer ${userData.token}`
      }
    }).then(response => {
      if (response.success === true) {
        console.log(response);
        setDataReferral(response.results.results);
      } else {
        alert("Error Ticket Revenue ! " + response.message);
        window.location.reload();
      }
    });
  };

  useEffect(() => {
    CallApiRefferal();
  }, []);
  return (
    <LayoutPageDashboard>
      <div className="p-5 space-y-5">
        <div className="relative overflow-y-scroll h-[510px] bg-slate-50">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-slate-200">
            <thead className="text-xs text-gray-700 uppercase ">
              <tr className="text-base">
                <th scope="col" className="px-6 py-3">
                  No
                </th>
                <th scope="col" className="px-6 py-3">
                  Kode Referral
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Harga Diskon
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Presentase Diskon
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-50">
              {dataReferral.map((value, key) => (
                <tr className="border-b" key={key}>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {key + 1}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {value.description}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                    {value.discount_price}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                    {value.discount_precentage} %
                  </td>

                  <td className="px-6 py-4 space-x-5 flex justify-between font-medium text-gray-900 whitespace-nowrap">
                    <button className="rounded-lg bg-amber-300 px-6 py-2 w-full hover:text-amber-800">
                      <Link to={`/dashboard/referral-code/edit/${value.id}`} >
                      Edit
                      </Link>
                    </button>
                    <button  className="rounded-lg border border-red-500 text-red-400 px-6 py-2 w-full hover:bg-red-400 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center">
              <button className="bg-amber-300 px-4 py-1 rounded my-5">
                  <Link to={'/dashboard/referral-code/create'} >Buat Event</Link>
                </button>
              <h5>
                Hai, terima kasih telah menggunakan layanan Tiket Soulofjakarta
              </h5>
              <p>
                Silakan buat eventmu dengan klik button “Buat Event” di atas.
              </p>
            </div>
        </div>
        {/* {renderPagination()} */}
      </div>
    </LayoutPageDashboard>
  );
};

export default ReferralCodePage;
