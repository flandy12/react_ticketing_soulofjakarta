import { useParams } from "react-router-dom";
import LayoutPageDashboard from "../layout";
import { CallApi, GetKey } from "../../../helper/Api";
import { useEffect, useState } from "react";

const EditReferral = () => {
  const { id } = useParams();
  const userData = JSON.parse(localStorage.getItem("user_data"));
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);

  const ViewRefferal = () => {
    CallApi(`v1/referral-code/view/${id}`, {
      method: "GET",
      headers: {
        "x-client-token": GetKey,
        Accept: "application/json",
        Authorization: `Bearer ${userData.token}`
      }
    }).then(response => {
      if (response.success === true) {
        console.log(response);
        console.log(data);
        setData(response.results);
      } else {
        alert("Error Ticket Revenue ! " + response.message);
        window.location.reload();
      }
    });
  };

  const ViewEventPromotor = async () => {
    let formData = new FormData();
    formData.append("sort[start_at]", "ASC");

    await CallApi(`v1/event/${userData.user.promotor.id}`, {
      method: "POST",
      headers: {
        "x-client-token": GetKey,
        Accept: "application/json",
        Authorization: `Bearer ${userData.token}`
      },
      body: formData
    }).then(ress => {
      console.log(ress);
      if (ress.success === true) {
        let data = ress.results.original.data;
        console.log(data)
        setEvents(data);
      }
    });
  };


  useEffect(() => {
    ViewEventPromotor();
    ViewRefferal();
  }, []);

  return (
    <LayoutPageDashboard>
      <section className="space-y-5 mt-5">

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-4">
            <label className="font-semibold">Kode Referral</label>
            <input
              type="text"
              id="create-event-name-edit"
              placeholder="Nama Event*"
              maxLength="100"
              spellCheck="false"
              className="px-3 py-3 w-full bg-slate-100"
              name="name"
              defaultValue={data.description}
            />
          </div>

          <div className="space-y-4">
            <label className="font-semibold">Tanggal Kadaluarsa</label>
            <input
             type="datetime-local"
              id="create-event-name-edit"
              placeholder="Nama Event*"
              maxLength="100"
              spellCheck="false"
              className="px-3 py-3 w-full bg-slate-100"
              name="name"
              defaultValue={data.expired_date}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-4">
            <label className="font-semibold">Diskon Persentase</label>
            <input
              type="text"
              id="create-event-name-edit"
              placeholder="Nama Event*"
              maxLength="100"
              spellCheck="false"
              className="px-3 py-3 w-full bg-slate-100"
              name="name"
              defaultValue={data.discount_precentage}
            />
          </div>

          <div className="space-y-4">
            <label className="font-semibold"> Harga Diskon</label>
            <input
              type="text"
              id="create-event-name-edit"
              placeholder="Nama Event*"
              maxLength="100"
              spellCheck="false"
              className="px-3 py-3 w-full bg-slate-100"
              name="name"
              defaultValue={data.discount_price}
            />
          </div>

          <div className="space-y-4">
            <label  className="font-semibold">Jumlah Pesanan Minimum</label>
            <input
              type="text"
              id="create-event-name-edit"
              placeholder="Nama Event*"
              maxLength="100"
              spellCheck="false"
              className="px-3 py-3 w-full bg-slate-100"
              name="name"
              defaultValue={data.minimum_order}
            />
          </div>
        </div>
        <div className="block space-y-4">
          <label
            for="message"
            className="block mb-2 text-gray-900 font-semibold ">
            Your message
          </label>
          <textarea
            id="message"
            rows="4"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your thoughts here..." defaultValue={data.description}></textarea>
        </div>
        <div className="block">
          <label
            for="message"
            className="block mb-2 text-gray-900 font-semibold">
            Tiket
          </label>
          <p className="text-sm">
            * Kode Referral ini hanya bisa digunakan untuk tiket dibawah ini.
          </p>

          <ul className="bg-slate-100 px-4 py-3 space-y-3 border mt-5">
            {data.tickets
              ? Object.entries(data.tickets).map((values, key) => (
                  <li key={key}>{values[1].name}</li>
                ))
              : ""}
          </ul>
        </div>
      </section>
    </LayoutPageDashboard>
  );
};

export default EditReferral;
