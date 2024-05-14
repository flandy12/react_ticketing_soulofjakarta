import { Link, Navigate } from "react-router-dom";
import { CallApi, GetKey } from "../../../helper/Api";
import { useEffect, useState } from "react";
import LayoutPageDashboard from "../layout";

const EventPage = () => {
  const userData = JSON.parse(localStorage.getItem("user_data"));
  const [DataActive, setDataActive] = useState([]);
  const [DataTidakActive, setDataTidakActive] = useState([]);
  const [event, setEvent] = useState("EVENT AKTIF");
  const [click, setClick] = useState(false);

  const [dataEventPromotor, setDataEventPromotor] = useState([]);

  const MenuNav = e => {
    setEvent(e.target.getAttribute("data-target"));
  };

  const CheckPromotorProfile = () => {
    if (userData.user.email_verify) {
      // v1/member/profile
      const callMemberProfile = async () => {
        try {
          const data = await CallApi("v1/member/profile", {
            method: "GET",
            headers: {
              "x-client-token": GetKey,
              Accept: "application/json",
              Authorization: `Bearer ${userData.token}`
            }
          });
          if (data.success) {
            userData["user"]["results"] = data.results;
            localStorage.setItem("user_data", JSON.stringify(userData));
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.log(error);
        }
      };
      // v1/promoter
      const callPromoter = async () => {
        try {
          const data = await CallApi("v1/promoter", {
            method: "GET",
            headers: {
              "x-client-token": GetKey,
              Accept: "application/json",
              Authorization: `Bearer ${userData.token}`
            }
          });
          if (data.success) {
            if (data.results[0] && data.results[0].name) {
              userData["user"]["promotor"] = data.results[0];
              localStorage.setItem("user_data", JSON.stringify(userData));
            }
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.log(error);
        }
      };

      callMemberProfile();
      callPromoter();
    } else {
      return <Navigate to="/login" />;
    }
  };

  const API = () => {
    if (userData.promotor) {
      CheckPromotorProfile();
      if (userData.user.promotor && userData.user.promotor.id) {
        let formData = new FormData();
        CallApi(`v1/event/${userData.user.promotor.id}`, {
          method: "POST",
          headers: {
            "x-client-token": GetKey,
            Accept: "application/json",
            Authorization: `Bearer ${userData.token}`
          },
          body: formData
        }).then(ress => {
          if (ress.success === true) {
            setDataEventPromotor(ress.results.original.data);
            console.log(ress.results.original.data);
          }
        });
      }
    }
  };

  useEffect(() => {
    API();
  }, []);

  return (
    <LayoutPageDashboard>
      <div>
        <ul className="grid grid-cols-2 w-full text-center place-content-center py-4">
          <li
            className={`cursor-pointer ${
              event === "EVENT AKTIF" ? "bg-amber-300 py-2 w-full" : ""
            }`}
            onClick={MenuNav}
            data-target="EVENT AKTIF">
            <span
              className="cursor-pointer"
              onClick={MenuNav}
              data-target="EVENT AKTIF">
              EVENT AKTIF
            </span>
          </li>
          <li
            className={`cursor-pointer ${
              event === "EVENT TIDAK AKTIF" ? "bg-amber-300 py-2 w-full" : ""
            }`}
            onClick={MenuNav}
            data-target="EVENT TIDAK AKTIF">
            <span
              onClick={MenuNav}
              data-target="EVENT TIDAK AKTIF"
              className="cursor-pointer">
              EVENT TIDAK AKTIF
            </span>
          </li>
        </ul>
        <div
          id="EVENT AKTIF"
          className={`h-[550px] flex items-center justify-center ${
            event === "EVENT AKTIF" ? "" : "hidden"
          }`}>
          <div>
            <img
              src="../images/icon/belum_buat_event_811x456px.png"
              alt="asset event"
              className={`flex item-center justify-center mx-auto h-[400px] ${
                dataEventPromotor.filter(event => event.status === "Aktif")
                  .length > 0
                  ? "hidden"
                  : ""
              }`}
            />

            {dataEventPromotor
              .filter(event => event.status === "Aktif")
              .map((val, key) => (
                <div key={key} className="relative flex gap-5 items-start">
                  <div className="order-1 sm:ml-6 xl:ml-0">
                    <h3 className="mb-1 text-slate-900 font-semibold">
                      {val.name} -{" "}
                      <span className="text-red-500">{val.status}</span>
                    </h3>
                    <div className="prose prose-slate prose-sm text-slate-600 space-y-4">
                      <div className="flex gap-3">
                        <img
                          src="/images/icon/icon_calendar_.svg"
                          alt="calendar"
                        />
                        <div className="flex gap-3">
                          <p>
                            {new Date(val.normal_start_at).toLocaleDateString()}
                          </p>{" "}
                          -{" "}
                          <p>
                            {new Date(val.normal_end_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {val.venue !== null ? (
                        <div className="flex gap-3">
                          <img
                            src="/images/icon/location_.svg"
                            alt="location"
                          />
                          <div className="flex gap-3">
                            <p>{val.venue}</p> - <p>{val.city.name}</p>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="flex gap-3">
                        <img src="/images/icon/icon_clock_.svg" alt="time" />
                        <div className="flex gap-3">
                          <p>{val.normal_start_at}</p> -{" "}
                          <p>{val.normal_end_at}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <img
                    src={val.img_path}
                    alt=""
                    className="mb-6 shadow-md rounded-lg bg-slate-50  sm:mb-0 xl:mb-6 aspec-video w-[300px]"
                  />
                </div>
              ))}

            <div className="text-center">
              <button className="bg-amber-300 px-4 py-1 rounded my-5">
                  <Link to={'/dashboard/event/create'} >Buat Event</Link>
                </button>
              <h5>
                Hai, terima kasih telah menggunakan layanan Tiket Soulofjakarta
              </h5>
              <p>
                Silakan buat eventmu dengan klik button “Buat Event” di atas.
              </p>
            </div>
          </div>
        </div>
        <div
          id="EVENT TIDAK AKTIF"
          className={`h-[550px] ${
            dataEventPromotor.filter(event => event.status === "Tidak Aktif")
              .length > 0
              ? ""
              : "flex"
          }  items-center ${event === "EVENT TIDAK AKTIF" ? "" : "hidden"}`}>
          <div class="">
            <img
              src="../images/icon/belum_buat_event_811x456px.png"
              alt="asset event"
              className={`flex item-center justify-center mx-auto h-[400px] ${
                dataEventPromotor.filter(
                  event => event.status === "Tidak Aktif"
                ).length > 0
                  ? "hidden"
                  : ""
              }`}
            />
            <div className="space-y-5">
              {dataEventPromotor
                .filter(event => event.status === "Tidak Aktif")
                .map((val, key) => (
                  <div key={key} className="relative flex gap-5 items-start">
                    <div className="order-1 sm:ml-6 xl:ml-0 space-y-2">
                      <h3 className="mb-1 text-slate-900 font-semibold">
                        {val.name} -{" "}
                        <span className="text-red-500">{val.status}</span>
                      </h3>
                      <div className="prose prose-slate prose-sm text-slate-600 space-y-2">
                        <div className="flex gap-3">
                          <img
                            src="/images/icon/icon_calendar_.svg"
                            alt="calendar"
                          />
                          <div className="flex gap-3">
                            <p>
                              {new Date(
                                val.normal_start_at
                              ).toLocaleDateString()}
                            </p>{" "}
                            -{" "}
                            <p>
                              {new Date(val.normal_end_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {val.venue !== null ? (
                          <div className="flex gap-3">
                            <img
                              src="/images/icon/location_.svg"
                              alt="location"
                            />
                            <div className="flex gap-3">
                              <p>{val.venue}</p> - <p>{val.city.name}</p>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}

                        <div className="flex gap-3">
                          <img src="/images/icon/icon_clock_.svg" alt="time" />
                          <div className="flex gap-3">
                            <p>{val.normal_start_at}</p> -{" "}
                            <p>{val.normal_end_at}</p>
                          </div>
                        </div>

                        <button className="bg-amber-300 px-4 py-1 rounded">
                          <Link to={`/dashboard/event/edit/${val.id}`}>Edit Event</Link>
                        </button>
                      </div>
                    </div>
                    <img
                      src={val.img_path}
                      alt=""
                      className="mb-6 shadow-md rounded-lg bg-slate-50  sm:mb-0 xl:mb-6 aspec-video h-full max-w-[300px]"
                      fetchpriority="high"
                    />
                  </div>
                ))}
            </div>

            <div className="text-center">
                <button className="bg-amber-300 px-4 py-1 font-normal  rounded my-5">
                   <Link to={'/dashboard/event/create'}  >Buat Event</Link>
                </button>
              <h5>
                Hai, terima kasih telah menggunakan layanan Tiket Soulofjakarta
              </h5>
              <p>
                Silakan buat eventmu dengan klik button “Buat Event” di atas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </LayoutPageDashboard>
  );
};

export default EventPage;
