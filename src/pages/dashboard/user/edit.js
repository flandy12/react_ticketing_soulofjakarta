import { useEffect, useState } from "react";
import { CallApi, GetKey } from "../../../helper/Api";
import LayoutPageProfie from "./layout";
import { Link, Navigate } from "react-router-dom";
import LoadingAnimation from "../../compoments/loading";
import { ToastError, ToastSuccess } from "../../compoments/toast";

const EditProfile = () => {
  const UserData = JSON.parse(localStorage.getItem("user_data"));
  const [province, setProvince] = useState({});
  const [selectProvince, setSelectProvince] = useState(0);
  const [selectCity, setSelectCity] = useState({});
  const [menuProvinceActive, setMenuProvinceActive] = useState(false);
  const [gender, setGender] = useState("");
  const [onClikGender, setOnClickGender] = useState(false);
  const [click, setClick] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [messageToastSucces, setMessageToastSucces] = useState(null);
  const [messageToastError, setMessageToastError] = useState(null);

  var selectCityKey;

  const CallApiData = () => {
    setGender(UserData.user.results.member.gender === "Laki-Laki" ? "1" : "2");
    setSelectCity(
      UserData.user.results.cities[UserData.user.results.member.city_id - 1]
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

  const UpdateProfile = () => {
    setClick(true);

    const data = {
      name: document.getElementById("name-edit").value,
      email: document.getElementById("email-edit").value,
      phone_number: "62" + document.getElementById("phone-number-edit").value,
      domicile_city: selectCity.id,
      domicile_address: document.getElementById("domicile-address-edit").value,
      gender: parseInt(gender),
      date_of_birth: document.getElementById("date-edit").value
    };

    const CallUserProfile = async () => {
      try {
        const data = await CallApi("v1/member/profile", {
          method: "GET",
          headers: {
            "x-client-token": GetKey,
            Accept: "application/json",
            Authorization: `Bearer ${UserData.token}`
          }
        });
        if (data.success) {
          UserData["user"]["results"]["cities"] = data.results.cities;
          UserData["user"]["results"]["member"] = data.results.member;
          localStorage.setItem("user_data", JSON.stringify(UserData));
          setClick(false);
          setShowToast(true);
          setMessageToastSucces("Berhasi Update Profile");

          //Remove Toast
          setTimeout(() => {
            setShowToast(false);
            setMessageToastSucces("");
          }, 1000);
        } else {
          setShowToast(true);
          setMessageToastError("Error Update Profile");

          //Remove Toast
          setTimeout(() => {
            setShowToast(false);
            setMessageToastSucces("");
          }, 1000);

          alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    CallApi("v1/member/profile/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-client-token": GetKey,
        Accept: "application/json",
        Authorization: `Bearer ${UserData.token}`
      },
      body: new URLSearchParams(data)
    }).then(response => {
      // loading.classList.add('active');
      // loading.innerHTML = item_loading;
      if (response.success === true) {
        CallUserProfile();
      } else {
        let error_message = response.errors;
        console.log(error_message);
        // loading.classList.remove('active');
        // loading.innerHTML = '';
        // btn_submit_profile.classList.remove('hidden');
        // let wrapper_error = document.getElementById('error-list-dashboard');
        // let errorString = '';
        // Object.keys(error_message).forEach(function (key) {
        //     errorString += `
        // <ul class="my-2">
        //     <li class="text-danger"> ${key, error_message[key]}</li>
        // </ul>`;
        // });
        // wrapper_error.classList.add('active');
        // wrapper_error.innerHTML = errorString;
      }
    });
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

  const HandleSelectGender = () => {
    onClikGender ? setOnClickGender(false) : setOnClickGender(true);
  };

  const HandleSelectGenderValue = e => {
    setGender(e.target.getAttribute("data-target"));
    setOnClickGender(false);
  };

  useEffect(() => {
    CallApiData();
  }, []);

  return (
    <diiv className="h-screen">
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
      <LayoutPageProfie>
        <div className="w-full">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-first-name">
                Nama Lengkap
              </label>
              <input
                className="appearance-none block w-full bg-slate-100 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="name-edit"
                type="text"
                placeholder="Masukan nama lengkap"
                defaultValue={UserData.user.results.member.name}
              />
              <p className="text-red-500 text-xs italic">
                Please fill out this field.
              </p>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-last-name">
                Alamat Email
              </label>
              <input
                className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="email"
                placeholder="Masukan alamat email"
                id="email-edit"
                defaultValue={UserData.user.results.member.email}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-first-name">
                No. Telepon
              </label>
              <input
                className="appearance-none block w-full bg-slate-100 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                placeholder="08**********"
                defaultValue={UserData.user.results.member.phone_number.replace(
                  "62",
                  ""
                )}
                id="phone-number-edit"
              />
              <p className="text-red-500 text-xs italic">
                Please fill out this field.
              </p>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-last-name">
                Jenis kelamin
              </label>

              <div className="relative inline-block text-left w-full">
                <div>
                  <button
                    type="button"
                    className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 py-3 px-4 uppercase"
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true"
                    onClick={HandleSelectGender}>
                    {gender === "Laki-Laki" || gender === "1"
                      ? "Laki-Laki"
                      : "Perempuan"}
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
                </div>

                <div
                  className={`absolute right-0 z-10 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-slate-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none w-full ${
                    !onClikGender ? "hidden" : ""
                  }`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabindex="-1">
                  <div className="py-1" role="none">
                    <span
                      className="text-gray-700 cursor-pointer block px-4 py-2 text-sm hover:bg-slate-200"
                      data-target="1"
                      onClick={HandleSelectGenderValue}>
                      Laki-Laki
                    </span>
                    <span
                      className="text-gray-700 cursor-pointer block px-4 py-2 text-sm hover:bg-slate-200"
                      data-target="2"
                      onClick={HandleSelectGenderValue}>
                      Perempuan
                    </span>
                  </div>
                  <div className="py-1" role="none"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-password">
                Tanggal Lahir
              </label>
              <input
                className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="date-edit"
                type="date"
                defaultValue={UserData.user.results.member.date_of_birth}
              />
              <p className="text-gray-600 text-xs italic">
                Make it as long and as crazy as you'd like
              </p>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full  px-3 mb-6 md:mb-0">
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
                            } ${key === selectCityKey ? "font-semibold" : ""}`}
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
            </div>

            <div></div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full  px-3 mb-6 md:mb-0">
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
                defaultValue={UserData.user.results.member.address}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            className="bg-amber-300 py-2 rounded px-8 font-semibold"
            onClick={UpdateProfile}>
            Update Profile
          </button>
          <button>
            <Link to={"/dashboard/profile"}> Kembali </Link>
          </button>
        </div>
      </LayoutPageProfie>
    </diiv>
  );
};

export default EditProfile;
