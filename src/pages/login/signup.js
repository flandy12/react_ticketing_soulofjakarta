import { useLocation } from "react-router-dom";
import Navbar from "../compoments/navbar";
import { useState } from "react";
import { CallApi, GetKey } from "../../helper/Api";
import LoadingAnimation from "../compoments/loading";
// import Image from "../images/asset/bg-asset-2.jpg";
// import Image from ''
const Signup = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const Id = searchParams.get("id") ? searchParams.get("id") : "";
  const Hash = searchParams.get("hash") ? searchParams.get("hash") : "";
  const Expires = searchParams.get("expires") ? searchParams.get("expires") : "";
  const Signature = searchParams.get("signature") ? searchParams.get("signature") : "";
  const [click, setClick] = useState(false);

  const handleClick = e => {
    setClick(true);
    e.preventDefault();
    const formDataUser = document.getElementById("LoginUser");
    const Username = document.getElementById("email");
    const Password = document.getElementById("password");

    Username.innerHTML = "";
    Password.innerHTML = "";

    let formdata = new FormData(formDataUser);
    CallApi("login", {
      method: "POST",
      headers: {
        "x-client-token": GetKey,
        Accept: "application/json"
      },
      body: formdata
    })
      .then(ress => {
        if (ress.success === true) {
          localStorage.setItem("user_data", JSON.stringify(ress.results));
          setTimeout(() => {
            setClick(false);
            if (Id && Hash) {
              window.location.href =  "/verify-email/" +Id + "/" +Hash +"?expires=" +Expires +"&signature=" + Signature;
            } else {
              window.location.href = "/";
            }
          }, 500);
        } else {
          let error_message = ress.errors;
          if (error_message) {
            Object.keys(error_message).forEach((value, key) => {
              setClick(false);
              let error_messagee = document.getElementById(value);
              if (error_messagee) {
                error_messagee.innerHTML = error_message[value][0];
              }
            });
          }

          console.log(ress);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <>
      <LoadingAnimation click={click} />
      <div className="bg-gray-950 h-screen ">
        <div
          className="bg-no-repeat bg-cover bg-opacity-50"
          style={{
            backgroundImage: "url(" + "../images/asset/bg-asset-2.jpg" + ")"
          }}>
          <Navbar />
          <div className="h-screen flex m-auto items-center flex-col justify-center ">
            <div className="flex m-auto items-center flex-col justify-center px-6 py-12 lg:px-8  rounded-lg w-full  text-white">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm"></div>

              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <input type="hidden" id="Id" value={Id} />
                <input type="hidden" id="Hash" value={Hash} />
                <input type="hidden" id="Expires" value={Expires} />
                <input type="hidden" id="Signature" value={Signature} />

                <form className="space-y-6" id="LoginUser">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-200">
                      Nama Lengkap
                    </label>
                    <div className="mt-2">
                      <input
                        name="fullname"
                        type="text"
                        autoComplete="email"
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 z-10"
                        placeholder="Nama Lengkap"
                      />
                      <p className="text-red-500 mt-2" id="email"></p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-200">
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 z-10"
                        placeholder="Alamat Email"
                      />
                      <p className="text-red-500 mt-2" id="email"></p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-200">
                        Password
                      </label>
                      <div className="text-sm"></div>
                    </div>
                    <div className="mt-2">
                      <input
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6 px-2"
                        placeholder="Masukan Password"
                      />
                      <p className="text-red-500 mt-2" id="password"></p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-200">
                        Konfirmasi Password
                      </label>
                      <div className="text-sm"></div>
                    </div>
                    <div className="mt-2">
                      <input
                        name="`confirmation_password"
                        type="password"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6 px-2"
                        placeholder="Konfirmasi Password"
                      />
                      <p className="text-red-500 mt-2" id="password"></p>
                    </div>
                  </div>

                  <div>
                    <button
                      className="flex w-full justify-center rounded-md bg-yellow-300 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                      onClick={handleClick}>
                      Daftar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
