import { useParams } from "react-router-dom";
import LayoutPageDashboard from "../layout";
import { CallApi, GetKey } from "../../../helper/Api";
import { useEffect, useState } from "react";

const CreateReferral = () => {
  const { id } = useParams();
  const userData = JSON.parse(localStorage.getItem("user_data"));
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);


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

  const DetailTicket = (e) => {
    e.preventDefault();
    const event_view = document.getElementById('category-events-edit');
    var id = event_view.options[event_view.selectedIndex].value;
    CallApi(`v1/ticket/${id}`, {
        method: 'POST',
        headers: {
            'x-client-token': GetKey,
            'Accept': 'application/json',
            'Authorization': `Bearer ${userData.token}`
        },
    }).then(ress => {
        if (ress.success === true) {

            let element_ticket = ress.results.original.data;
            setTickets(element_ticket);

        } else {
            console.log(ress);
        }
    })
  }

  useEffect(() => {
    ViewEventPromotor();
    ViewRefferal();
  }, []);

  return (
    <LayoutPageDashboard>
      <section className="space-y-5 my-5">
        <div className="grid grid-cols-5  gap-3 space-y-3">
          <div className="col-span-4">
            <label className="font-semibold">Pilih Event</label>
            <div className="mt-2">
              <select
                className="form-select m-0 bg-slate-100 border w-full py-2 px-3"
                aria-label="Default select example"
                id="category-events-edit"
                name="category">
                  {events.map((value,key) => (
                     <option value={value.id} key={key}>{value.name}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid items-end w-full">
            <button className="bg-amber-300 px-5 py-2 w-full rounded" onClick={DetailTicket}>Pilih Event</button>
          </div>
        </div>

        <div className="">
          <div className="col-span-4 space-y-3">
            <label className="font-semibold">Kategori Tiket</label>
            <p>Klik <b>'Pilih Tiket'</b> untuk melihat daftar lengkap tiket yang tersedia</p>
            <div className="my-2">
              <select
                className="form-select m-0 bg-slate-100 border w-full py-2 px-3"
                aria-label="Default select example"
                id="category-events-edit"
                name="model_id[]" 
                multiple
                >
                  {tickets.map((value,key) => (
                     <option defaultValue={key + 1} key={key}>{value.name}</option>
                  ))}
              </select>
            </div>
          </div>
        </div>

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
              defaultValue={data.description}
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
              defaultValue={data.description}
            />
          </div>

          <div className="space-y-4">
            <label className="font-semibold">Harga Diskon</label>
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
            <label className="font-semibold">Jumlah Pesanan Minimum</label>
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
        </div>
        <div className="block space-y-4">
          <label
            for="message"
            className="block mb-2 font-semibold text-gray-900 ">
            Your message
          </label>
          <textarea
            id="message"
            rows="4"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your thoughts here..."></textarea>
        </div>
        <div className="block space-y-4">
          <label
            for="message"
            className="block mb-2  text-gray-900 font-semibold">
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

export default CreateReferral;
