import { Link } from "react-router-dom";
import LayoutPageDashboard from "../layout";
import { useEffect, useState } from "react";
import { CallApi, GetKey } from "../../../helper/Api";
import { ToastError, ToastSuccess } from "../../compoments/toast";
import LoadingAnimation from "../../compoments/loading";

const LayoutPageProfie = ({ children }) => {
  const UserData = JSON.parse(localStorage.getItem("user_data"));
  const [promotor, setPromotor] = useState({});
  const [province, setProvince] = useState({});
  const [selectProvince, setSelectProvince] = useState(0);
  const [selectCity, setSelectCity] = useState({});
  const [menuProvinceActive, setMenuProvinceActive] = useState(false);
  const [onClikGender, setOnClickGender] = useState(false);
  const [click, setClick] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [messageToastSucces, setMessageToastSucces] = useState(null);
  const [messageToastError, setMessageToastError] = useState(null);

  const [showPromotor, setShowPromotor] = useState("show-promotor");

  var selectCityKey;
  const HandleClickDetailPromotor = () => {
    setShowPromotor("detail-promotor");
    setPromotor(UserData.user.promotor);
  };

  const HandleMenuProvince = () => {
    menuProvinceActive
      ? setMenuProvinceActive(false)
      : setMenuProvinceActive(true);
  };

  const HandleSelectProvince = e => {
    parseInt(e.target.getAttribute("data-target")) === selectProvince
      ? setSelectProvince(0)
      : setSelectProvince(parseInt(e.target.getAttribute("data-target")));
  };

  const HandleSelectCity = e => {
    setSelectCity(
      UserData.user.results.cities[e.target.getAttribute("data-target")]
    );
    selectCityKey = e.target.getAttribute("data-target");
    setSelectProvince(0);
    setMenuProvinceActive(false);
  };

  const CallApiData = () => {
    setSelectCity(
      UserData.user.results.cities[UserData.user.promotor.city_id - 1]
    );
    try {
      CallApi(`province`, {
        method: "GET",
        headers: {
          "x-client-token": GetKey,
          Accept: "application/json"
        }
      }).then(ress => {
        if (ress.success === true) {
          UserData["user"]["results"]["province"] = ress.results;
          setProvince(ress.results);
          localStorage.setItem("user_data", JSON.stringify(UserData));
        }
      });
    } catch (err) {
      console.log("error" + err);
    }
  };

  const UpdatePromotor = () => {
    //Update Promotor
    const value_promotor_ = {
      name: document.getElementById("name-promotor-edit").value,
      city: selectCity.id,
      address: document.getElementById("domicile-address-edit").value
    };

    // console.log(value_promotor_);
    CallApi("v1/promoter/update/" + promotor.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-client-token": GetKey,
        Accept: "application/json",
        Authorization: `Bearer ${UserData.token}`
      },
      body: new URLSearchParams(value_promotor_)
    }).then(response => {
      if (response.success === true) {
        UserData['user']['promotor'] = response.results;
        localStorage.setItem('user_data', JSON.stringify(UserData));
        setShowToast(true);
        setMessageToastSucces("Berhasil Update Promotor");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        let error_message = response.errors;
        console.log(error_message);
        // let errorString = '';
        // Object.keys(error_message).forEach(function (key) {
        //     errorString += `
        //     <ul class="my-2">
        //         <li class="text-danger"> ${key, error_message[key]}</li>
        //     </ul>`;
        // });
      }
    });
  };

  useEffect(() => {
    CallApiData();
  }, []);

  return (
    <>
      <LoadingAnimation click={click} />
      <div
        className={`fixed bottom-0 right-5 z-50 ${
          showToast === false ? "hidden" : ""
        }`}>
        {messageToastSucces !== null ? (
          <ToastSuccess message={messageToastSucces} />
        ) : (
          <ToastError message={messageToastError} />
        )}
      </div>
      <LayoutPageDashboard>
        <div className="p-5 space-y-5">
          <section className="shadow-lg rounded">
            <div className="flex p-3">
              <div className="flex gap-4 ">
                <div className="col-auto">
                  <img
                    src={`https://ui-avatars.com/api/?name=${UserData.user.name}&color=7F9CF5&background=EBF4FF`}
                    className="user-profile"
                    alt="profile_image"
                  />
                </div>
                <div>
                  <h5 className="mb-1 user-name font-semibold">
                    {UserData.user.name}
                  </h5>
                  <div className="numbers">
                    <button
                      className={`py-1 px-4 rounded ${
                        UserData.user.email_verify
                          ? "bg-green-300"
                          : "Verifikasi Email"
                      }`}
                      id="verification-email">
                      {UserData.user.email_verify
                        ? "Email Terverifikasi"
                        : "Verifikasi Email"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="shadow-lg p-5 rounded space-y-5">
            {children}
          </section>
          <section className="shadow-lg p-5 space-y-5">
            <div
              className={`${
                showPromotor === "show-promotor" ? "block" : "hidden"
              }`}>
              <div className="flex justify-between items-center border-radius-0 mb-5">
                <h2 className="text-xl font-bold">INFORMASI PROMOTOR</h2>
              </div>

              <div className="relative overflow-x-auto border sm:rounded-lg">
                <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-slate-500">
                        #
                      </th>
                      <th scope="col" className="px-6 py-3 text-slate-500">
                        Nama Promotor
                      </th>
                      <th scope="col" className="px-6 py-3 text-slate-500">
                        Kota
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-slate-500 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="">
                      <th
                        scope="row"
                        className="px-6 py-4 text-base text-gray-900 whitespace-nowrap ">
                        1
                      </th>
                      <td className="px-6 py-4 text-base text-gray-900">
                        {UserData.user.promotor.name}
                      </td>
                      <td className="px-6 py-4 text-base text-gray-900">
                        {UserData.user.promotor.city}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          className="text-base bg-amber-300 px-6 py-1 text-black font-semibold"
                          onClick={HandleClickDetailPromotor}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div
              className={`${
                showPromotor === "detail-promotor" ? "block" : "hidden"
              }`}>
              <div className="w-full">
                <div className="w-full px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    for="grid-first-name">
                    Nama Lengkap
                  </label>
                  <input
                    className="appearance-none block w-full bg-slate-100 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="name-promotor-edit"
                    type="text"
                    placeholder="Masukan nama lengkap"
                    defaultValue={UserData.user.promotor.name}
                  />
                  <p className="text-red-500 text-xs italic">
                    Please fill out this field.
                  </p>
                </div>

                <div className="w-full px-3 mb-6 md:mb-0  mt-4">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    for="grid-city">
                    Kota
                  </label>

                  <div className="dropdown inline-block  w-full">
                    <button
                      className="bg-slate-100 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center w-full justify-between"
                      onClick={HandleMenuProvince}>
                      {selectCity.name ? selectCity.name : "Pilih Kota"}
                      <svg
                        className="-mr-1 h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          fill-rule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                    <ul
                      className={`dropdown-content ${
                        !menuProvinceActive ? "hidden" : ""
                      } text-gray-700 pt-1`}>
                      {Object.entries(province).map((value, key) => (
                        <li key={key}>
                          <button
                            className={`flex rounded-t bg-slate-200 hover:bg-gray-400 py-2 px-4 w-full justify-between ${
                              selectProvince === key + 1 ? "font-semibold" : ""
                            }`}
                            data-target={key + 1}
                            onClick={HandleSelectProvince}>
                            {UserData.user.results.province[key + 1]}
                            <svg
                              className="-mr-1 h-5 w-5 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true">
                              <path
                                fill-rule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </button>
                          <ul
                            className={` ${
                              selectProvince > 0 ? "" : ""
                            } text-gray-700 `}>
                            {UserData.user.results.cities.map((value, key) => (
                              <li
                                key={key}
                                className={`cursor-pointer ${
                                  value.province_id === selectProvince
                                    ? ""
                                    : "hidden"
                                } ${
                                  key === selectCityKey ? "font-semibold" : ""
                                }`}
                                data-target={key}
                                onClick={HandleSelectCity}>
                                <span
                                  onClick={HandleSelectCity}
                                  data-target={key}
                                  className={`hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap ${
                                    key === selectCityKey
                                      ? "font-semibold"
                                      : "bg-slate-100 "
                                  } `}>
                                  {value.name}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div></div>
                </div>
                <div className="w-full px-3 mb-6 md:mb-0  mt-4">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    for="grid-city">
                    Alamat
                  </label>
                  <input
                    className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="domicile-address-edit"
                    type="text"
                    placeholder="Masukan alamat"
                    defaultValue={UserData.user.promotor.address}
                  />
                </div>
              </div>

              <div className="flex gap-4 px-3 mt-4">
                <button
                  className="bg-amber-300 py-2 rounded px-8 font-semibold"
                  onClick={UpdatePromotor}>
                  Update Promotor
                </button>
                <button>
                  <Link
                    to={"/dashboard/profile"}
                    onClick={() => setShowPromotor("show-promotor")}>
                    {" "}
                    Kembali{" "}
                  </Link>
                </button>
              </div>
            </div>
          </section>
        </div>
      </LayoutPageDashboard>
    </>
  );
};

export default LayoutPageProfie;
