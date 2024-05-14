import { useEffect, useState } from "react";
import { CallApi, GetKey, GetUrl } from "../../helper/Api";
import { Link } from "react-router-dom";
import LoadingAnimation from "../compoments/loading";
import Navbar from "../compoments/navbar";

const HomePage = () => {
  const [event, setEvent] = useState([]);
  const [category, setCategory] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    API();
  }, []);

  const API = () => {
    CallApi("event-dashboard", {
      method: "GET",
      headers: {
        "x-client-token": GetKey,
        Accept: "application/json"
      }
    })
      .then(res => {
        if (res.success === true) {
          setEvent(
            res.results.testing && res.results.testing.length > 0
              ? res.results.testing
              : res.results.events
          );
          setCategory(res.results.categories);
          setLoading(false);
        } else {
          console.log(res);
        }
      })
      .catch(err => {
        // alert('Connection Failed');
        console.log(err);
      });
  };

  const HomeContainer = () => {
    return (
      <div className="">
        <div className="container mx-auto">
          <Carousel />

          <div className="flex justify-between my-4 mx-5">
            <h1>Event</h1>
            <p>Selengkapnya</p>
          </div>
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2  flex-wrap justify-start  gap-5 mx-5">
            {event.map((value, key) => (
              <Link to={`/detail/${value.id}`} className="" key={key}>
                <div className="w-full col max-md:w-full px-4 py-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 h-[390px] min-h-[412px] grid justify-between gap-3 ">
                  <img
                    className="rounded-t-lg h-[139px] object-cover w-auto "
                    src={`${value.main_img}`}
                    alt="img-event"
                    fetchpriority="high"
                    loading="lazy"
                  />

                  <div className="space-y-5">
                    <div>
                      <h5
                        className="text-lg font-bold tracking-tight text-gray-800  whitespace-normal  overflow-hidden h-[60px] max-h-full w-full line-clamp-2 "
                        title={value.name}>
                        {value.name}
                      </h5>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-5">
                        <img
                          src="/images/icon/icon_calendar_.svg"
                          alt="calendar-asset"
                        />
                        <span>
                          {value.start_date} - {value.end_date}
                        </span>
                      </div>
                      <div className="flex gap-5">
                        <img
                          src="/images/icon/icon_clock_.svg"
                          alt="clock-asset"
                        />
                        <span>
                          {value.start_time} - {value.end_time}
                        </span>
                      </div>

                      <div
                        className={`${
                          value.venue === null ? "hidden" : "flex"
                        } gap-5`}>
                        <img
                          src="/images/icon/location_.svg"
                          alt="location-asset"
                        />
                        <span>{value.venue}</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 max-w-[120px]">
                      <span className="text-center">
                        IDR {value.from_price}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const SkeletonCardEvent = () => {
    let element = [];

    for (let index = 0; index < 3; index++) {
      element.push(
        <div>
          <div
            role="status"
            className="space-y-8 animate-pulse rtl:space-x-reverse md:flex md:items-center flex-col">
            <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded  dark:bg-gray-700">
              <svg
                className="w-10 h-10 text-gray-200 dark:text-gray-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18">
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            </div>
            <div className="w-full m-0">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
            </div>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
    return (
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-5 mt-6">
          {element.map((value, key) => (
            <div key={key} className="">
              {value}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Carousel = () => {
    let [count, setCount] = useState(0);
    let carousel_item = document.querySelectorAll(".carousel-item");

    useEffect(() => {
      if (count < carousel_item.length) {
        let interval = setInterval(() => {
          setCount(count + 1);
        }, 3000);
        return () => {
          clearInterval(interval);
        };
      } else {
        setCount(0);
        let interval = setInterval(() => {
          setCount(count + 1);
        }, 3000);
        return () => {
          clearInterval(interval);
        };
      }
    }, [count]);

    return (
      <div className="my-5 mx-5 z-10 relative">
        <div
          id="indicators-carousel"
          className=" w-full"
          data-carousel="static">
          <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
            {event.map((value, key) => (
              <div
                className={`${
                  key === count ? "" : "hidden"
                } duration-700 ease-in-out carousel-item`}
                data-carousel-item={`${key === count ? "active" : ""}`}
                id={`carousel-item-${key}`}
                key={key}>
                <img
                  src={`${value.main_img}`}
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const HomePageWrapper = () => {
    return (
      <>
        {/* <LoadingAnimation />
        <Navbar /> */}
        <div className="">
          {isLoading ? <SkeletonCardEvent /> : <HomeContainer />}
        </div>
      </>
    );
  };

  return (
    <>
      <HomePageWrapper />
    </>
  );
};

export default HomePage;
