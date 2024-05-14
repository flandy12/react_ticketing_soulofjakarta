import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { CallApi, GetKey } from "../../../helper/Api";
import LayoutPageDashboard from "../layout";
import LoadingAnimation from "../../compoments/loading";
import { Editor } from "@tinymce/tinymce-react";
import { createMarkup } from "../../user_gues/detail/page";

const CreateEvent = () => {
  const { id } = useParams();
  const [dataTicket, setDataTicket] = useState([]);
  const [detailEvent, setDetailEvent] = useState([]);
  const [menuNav, setMenuNav] = useState("EVENT KATEGORI");
  const [dataTicketView, setDataTicketView] = useState({});
  const [information, setInformation] = useState("");
  const [loading, setLoading] = useState(false);
  const [type_ticket, setTypeTicket] = useState("");

  const userData = JSON.parse(localStorage.getItem("user_data"));
  var all_day_pass_;
  var disable_qty_input_;
  var refund_;

  const editorRef = useRef(null);

  const MenuNav = e => {
    setMenuNav(e.target.getAttribute("data-target"));
  };

  const CallAPi = () => {
    CallApi(`v1/event/view/${id}`, {
      method: "GET",
      headers: {
        "x-client-token": GetKey,
        Accept: "application/json",
        Authorization: `Bearer ${userData.token}`
      }
    }).then(ress => {
      if (ress.success === true) {
        setDetailEvent(ress.results);
        /**
         * v1/ticket/Event Id
         */
        console.log(ress);
        CallApi(`v1/ticket/${ress.results.id}`, {
          method: "POST",
          headers: {
            "x-client-token": GetKey,
            Accept: "application/json",
            Authorization: `Bearer ${userData.token}`
          }
        }).then(ress => {
          let element_ticket = ress.results.original.data;
          setDataTicket(element_ticket);
        });
      }
    });
  };

  const GetTicket = e => {
    setDataTicketView(dataTicket[e.target.getAttribute("data-compoment")]);
  };

  const CloseModal = () => {
    setDataTicketView({});
    setTypeTicket("");
  };

  const UpdateTicket = () => {
    setLoading(true);
    setDataTicketView({});

    const formData = new FormData(
      document.getElementById("modal-tiket-update")
    );
    const all_daypass =
      all_day_pass_ !== undefined
        ? all_day_pass_
        : document.getElementById("all-day-pass-checkbox").value;
    const disable_qty_input =
      disable_qty_input_ !== undefined
        ? all_day_pass_
        : document.getElementById("disabled-checked-checkbox").value;
    const refund =
      refund_ !== undefined
        ? refund_
        : document.getElementById("refund-checked-checkbox").value;
    const ticket_price = Intl.NumberFormat("en-DE").format(
      document.getElementById("ticket_price").value
    );

    formData.append("all_day_pass", all_daypass);
    formData.append("disable_qty", disable_qty_input);
    formData.append("refund", refund);
    formData.append("price", ticket_price);
    formData.append("_method", "PUT");

    CallApi(`v1/ticket/update/${dataTicketView.id}`, {
      method: "POST",
      headers: {
        "x-client-token": GetKey,
        Accept: "application/json",
        Authorization: `Bearer ${userData.token}`
      },
      body: formData
    }).then(ress => {
      if (ress.success == true) {
        let resspon = ress.results;

        setTimeout(() => {
          setLoading(false);
        }, 800);
        // loading.classList.remove('active');
        // loading.innerHTML = '';
        // modal_id.classList.replace('active', 'fade');
        // Update Ticket ID
        // let warrapper_ticket_id = document.getElementById('tiket_item_' + code);

        // warrapper_ticket_id.innerHTML = updateTicketItem(resspon.code, resspon.id, resspon.name, resspon.start_at_form, resspon.end_at_form, resspon.prefix_seat_number, resspon.seat_number_from, resspon.seat_number_to, resspon.price_value, resspon.all_day_pass, resspon.disable_qty_input, resspon.qty, resspon.refund, true);

        window.location.reload();
      } else {
        setTimeout(() => {
          // loading.classList.remove('active');
          // loading.innerHTML = '';
          let error_message = ress.errors;

          Object.keys(error_message).forEach(function (key) {
            let error_item = document.getElementById(key + "_err");
            if (error_item) {
              error_item.textContent = `${(key, error_message[key])}`;
            }
          });
          console.log(ress.errors);
        }, 500);
      }
    });
  };

  const CheckboxAllDayPass = e => {
    all_day_pass_ = e.target.checked ? 1 : 0;
  };

  const CheckboxDisableQtyInput = e => {
    disable_qty_input_ = e.target.checked ? 1 : 0;
  };

  const CheckboxRefund = e => {
    refund_ = e.target.checked ? 1 : 0;
  };

  const convertDate = tanggalAwal => {
    // Parsing tanggal dari string
    const date = new Date(tanggalAwal);

    // Mendapatkan tanggal, jam, dan menit dari tanggal asli
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Menambahkan 0 di depan jika hanya satu digit
    const day = String(date.getDate()).padStart(2, "0"); // Menambahkan 0 di depan jika hanya satu digit
    const hours = String(date.getHours()).padStart(2, "0"); // Menambahkan 0 di depan jika hanya satu digit
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Menambahkan 0 di depan jika hanya satu digit

    // Mengembalikan format yang diinginkan
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const ModalTicket = () => {
    return (
      <div
        className={`pt-12 bg-black-opacity h-screen w-full fixed top-0 left-0 right-0 z-40 ${
          Object.keys(dataTicketView).length > 0 ? "" : "hidden"
        }`}
        id="modal-paid-wrapper-all">
        <div className=" bg-white m-auto w-[500px] ">
          <div className="modal-content ">
            <div className="bg-amber-300">
              <div className="px-6 py-3 flex justify-between">
                <h1 className="font-semibold text-lg">Edit Tiket </h1>
                <button
                  type="button"
                  className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onClick={CloseModal}>
                  <span className="sr-only">Close menu</span>
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="modal-body  overflow-y-scroll h-[400px]">
                <form id="modal-tiket-update">
                  <input
                    type="hidden"
                    name="_token"
                    value="DMxxnV6bJlzMYAytmWo8l0DY70gPF8gr8tUqnzW7"
                  />
                  <div id="wrapper-modal-paid">
                    <div className="border px-3 py-4 rounded mb-3">
                      <div>
                        <div className=" space-y-2 mb-4">
                          <label
                            for="exampleInputEmail1"
                            className="font-semibold ">
                            Nama Tiket
                          </label>
                          <input
                            type="text"
                            className="px-3 py-3 w-full bg-slate-100"
                            id="ticket_name"
                            aria-describedby="emailHelp"
                            placeholder="Masukan Nama Tiket"
                            name="name"
                            defaultValue={dataTicketView.name}
                          />

                          <p
                            className="text-danger my-2"
                            id="name_err"
                            data-element="name"></p>
                        </div>
                        <div className=" space-y-2 mb-4 ">
                          <label className="font-semibold">
                            Masa Penjualan Tiket
                          </label>
                          <div className="flex justify-between items-center gap-1 ">
                            <div>
                              <label
                                htmlFor="ticket_start_at"
                                className="font-semibold text-gray-500 text-sm">
                                Dimulai
                              </label>
                              <input
                                type="datetime-local"
                                id="ticket_start_at"
                                className="px-3 py-3 w-full bg-slate-100"
                                placeholder="Berlaku Dari"
                                defaultValue={convertDate(
                                  dataTicketView.start_at
                                )}
                                name="start_at"
                              />
                              <p
                                id="start_at_err"
                                className="text-danger my-2"></p>
                            </div>

                            <div>
                              <label
                                htmlFor="ticket_end_at"
                                className="font-semibold text-gray-500 text-sm">
                                Berakhir
                              </label>
                              <input
                                type="datetime-local"
                                className="px-3 py-3 w-full bg-slate-100"
                                id="ticket_end_at"
                                placeholder="Berlaku Hingga"
                                name="end_at"
                                defaultValue={convertDate(
                                  dataTicketView.end_at
                                )}
                              />
                              <p
                                id="end_at_err"
                                className="text-danger my-2"></p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <label className="font-semibold">
                          Susun Lokasi Duduk
                        </label>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="col">
                            <input
                              type="text"
                              id="prefix_number"
                              name="prefix_number"
                              className="px-3 py-3 w-full bg-slate-100"
                              placeholder="Jenis Kursi"
                              defaultValue={dataTicketView.prefix_number}
                            />
                          </div>

                          <div className="col">
                            <input
                              type="number"
                              className="px-3 py-3 w-full bg-slate-100"
                              id="seat_number_from"
                              placeholder="Dimulai Dari"
                              name="seat_number_from"
                            />
                          </div>

                          <div className="col">
                            <input
                              type="number"
                              className="px-3 py-3 w-full bg-slate-100"
                              id="seat_number_to"
                              placeholder="Sampai Dari"
                              name="seat_number_to"
                              defaultValue={dataTicketView.seat_number_to}
                            />
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400 my-2 text-base text-sm">
                            *Kosongkan apabila event anda tidak memiliki nomor
                            kursi
                          </span>
                          <p
                            id="seat_number_to_err"
                            className="text-danger my-2"></p>
                          <p
                            className="text-danger my-2"
                            id="seat_number_from_err"></p>
                          <p
                            className="text-danger my-2"
                            id="prefix_number_err"></p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <label className="font-semibold">Jumlah Tiket</label>
                        <input
                          type="number"
                          className="px-3 py-3 w-full bg-slate-100"
                          id="qty_ticket"
                          name="qty"
                          placeholder="Jumlah Tiket Yang Tersedia"
                          defaultValue={dataTicketView.qty}
                        />
                        <p
                          className="text-danger my-2"
                          id="qty_err"
                          data-element="qty"></p>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <div className="">
                            <label className="font-semibold">
                              Tiket All Day Pass
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="all-day-pass-checkbox"
                              type="checkbox"
                              defaultChecked={
                                dataTicketView.all_day_pass ? true : false
                              }
                              onChange={e => CheckboxAllDayPass(e)}
                              defaultValue={dataTicketView.all_day_pass ? 1 : 0}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <span className="text-gray-400 my-2 text-sm">
                          *Aktifkan jika tiket all day pass
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <label
                          for="exampleInputEmail1"
                          className="font-semibold">
                          Harga Tiket
                        </label>
                        <input
                          type=""
                          className="px-3 py-3 w-full bg-slate-100"
                          placeholder="Rp"
                          id="ticket_price"
                          defaultValue={dataTicketView.price}
                          name="price"
                        />
                        <p
                          id="price_err"
                          className="text-danger my-2"
                          data-element="price"></p>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <div className="">
                            <label className="font-semibold">
                              Non Aktifkan Jumlah Tiket
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="disabled-checked-checkbox"
                              name="disable_qty"
                              type="checkbox"
                              defaultChecked={
                                dataTicketView.disable_qty_input ? true : false
                              }
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "
                              onChange={e => CheckboxDisableQtyInput(e)}
                              defaultValue={
                                dataTicketView.disable_qty_input ? true : false
                              }
                            />
                          </div>
                        </div>
                        <span className="text-gray-400 mt-2 font-base text-sm">
                          *Aktifkan apabila tiket tidak bisa diatur jumlah
                          pembeliannya
                        </span>
                      </div>
                      <div className="space-y-5 mb-4">
                        <div className="flex justify-between">
                          <div className="">
                            <label className="font-semibold">
                              Pengembalian Dana
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="refund-checked-checkbox"
                              type="checkbox"
                              defaultChecked={
                                dataTicketView.refund ? true : false
                              }
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "
                              onChange={e => CheckboxRefund(e)}
                              defaultValue={dataTicketView.refund ? 1 : 0}
                              name="refund"
                            />
                          </div>
                        </div>
                        <span className="text-gray-400 my-2 font-base text-sm">
                          *Aktifkan apabila tiket dapat dilakukan proses
                          pengembalian dana
                        </span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <button
                type="button"
                className="bg-amber-300 py-2 px-5 font-semibold"
                id="v2-edit-ticket"
                data-target="modal-paid-wrapper-all"
                onClick={UpdateTicket}>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ModalTicketBerbayar = () => {
    return (
      <div
        className={`pt-12 bg-black-opacity h-screen w-full fixed top-0 left-0 right-0 z-40 ${
          type_ticket === "Berbayar" ? "" : "hidden"
        }`}
        id="modal-paid-wrapper-all">
        <div className=" bg-white m-auto w-[500px] ">
          <div className="modal-content ">
            <div className="bg-amber-300">
              <div className="px-6 py-3 flex justify-between">
                <h1 className="font-semibold text-lg">Buat Tiket Berbayar </h1>
                <button
                  type="button"
                  className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onClick={CloseModal}>
                  <span className="sr-only">Close menu</span>
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="modal-body  overflow-y-scroll h-[400px]">
                <form id="modal-tiket-update">
                  <input
                    type="hidden"
                    name="_token"
                    value="DMxxnV6bJlzMYAytmWo8l0DY70gPF8gr8tUqnzW7"
                  />
                  <div id="wrapper-modal-paid">
                    <div className="border px-3 py-4 rounded mb-3">
                      <div>
                        <div className=" space-y-2 mb-4">
                          <label
                            for="exampleInputEmail1"
                            className="font-semibold ">
                            Nama Tiket
                          </label>
                          <input
                            type="text"
                            className="px-3 py-3 w-full bg-slate-100"
                            id="ticket_name"
                            aria-describedby="emailHelp"
                            placeholder="Masukan Nama Tiket"
                            name="name"
                          />

                          <p
                            className="text-danger my-2"
                            id="name_err"
                            data-element="name"></p>
                        </div>
                        <div className=" space-y-2 mb-4 ">
                          <label className="font-semibold">
                            Masa Penjualan Tiket
                          </label>
                          <div className="flex justify-between items-center gap-1 ">
                            <div>
                              <label
                                htmlFor="ticket_start_at"
                                className="font-semibold text-gray-500 text-sm">
                                Dimulai
                              </label>
                              <input
                                type="datetime-local"
                                id="ticket_start_at"
                                className="px-3 py-3 w-full bg-slate-100"
                                placeholder="Berlaku Dari"
                                name="start_at"
                              />
                              <p
                                id="start_at_err"
                                className="text-danger my-2"></p>
                            </div>

                            <div>
                              <label
                                htmlFor="ticket_end_at"
                                className="font-semibold text-gray-500 text-sm">
                                Berakhir
                              </label>
                              <input
                                type="datetime-local"
                                className="px-3 py-3 w-full bg-slate-100"
                                id="ticket_end_at"
                                placeholder="Berlaku Hingga"
                                name="end_at"
                              />
                              <p
                                id="end_at_err"
                                className="text-danger my-2"></p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <label className="font-semibold">
                          Susun Lokasi Duduk
                        </label>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="col">
                            <input
                              type="text"
                              id="prefix_number"
                              name="prefix_number"
                              className="px-3 py-3 w-full bg-slate-100"
                              placeholder="Jenis Kursi"
                            />
                          </div>

                          <div className="col">
                            <input
                              type="number"
                              className="px-3 py-3 w-full bg-slate-100"
                              id="seat_number_from"
                              placeholder="Dimulai Dari"
                              name="seat_number_from"
                            />
                          </div>

                          <div className="col">
                            <input
                              type="number"
                              className="px-3 py-3 w-full bg-slate-100"
                              id="seat_number_to"
                              placeholder="Sampai Dari"
                              name="seat_number_to"
                            />
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400 my-2 text-sm">
                            *Kosongkan apabila event anda tidak memiliki nomor
                            kursi
                          </span>
                          <p
                            id="seat_number_to_err"
                            className="text-danger my-2"></p>
                          <p
                            className="text-danger my-2"
                            id="seat_number_from_err"></p>
                          <p
                            className="text-danger my-2"
                            id="prefix_number_err"></p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <label className="font-semibold">Jumlah Tiket</label>
                        <input
                          type="number"
                          className="px-3 py-3 w-full bg-slate-100"
                          id="qty_ticket"
                          name="qty"
                          placeholder="Jumlah Tiket Yang Tersedia"
                        />
                        <p
                          className="text-danger my-2"
                          id="qty_err"
                          data-element="qty"></p>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <div className="">
                            <label className="font-semibold">
                              Tiket All Day Pass
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="all-day-pass-checkbox"
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <span className="text-gray-400 my-2 text-sm">
                          *Aktifkan jika tiket all day pass
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <label
                          for="exampleInputEmail1"
                          className="font-semibold">
                          Harga Tiket
                        </label>
                        <input
                          type=""
                          className="px-3 py-3 w-full bg-slate-100"
                          placeholder="Rp"
                          id="ticket_price"
                          name="price"
                        />
                        <p
                          id="price_err"
                          className="text-danger my-2"
                          data-element="price"></p>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <div className="">
                            <label className="font-semibold">
                              Non Aktifkan Jumlah Tiket
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="disabled-checked-checkbox"
                              name="disable_qty"
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "
                            />
                          </div>
                        </div>
                        <span className="text-gray-400 mt-2 font-base text-sm">
                          *Aktifkan apabila tiket tidak bisa diatur jumlah
                          pembeliannya
                        </span>
                      </div>
                      <div className="space-y-5 mb-4">
                        <div className="flex justify-between">
                          <div className="">
                            <label className="font-semibold">
                              Pengembalian Dana
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="refund-checked-checkbox"
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "
                              onChange={e => CheckboxRefund(e)}
                              name="refund"
                            />
                          </div>
                        </div>
                        <span className="text-gray-400 my-2 font-base text-sm">
                          *Aktifkan apabila tiket dapat dilakukan proses
                          pengembalian dana
                        </span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <button
                type="button"
                className="bg-amber-300 py-2 px-5 font-semibold"
                id="v2-edit-ticket"
                data-target="modal-paid-wrapper-all"
                onClick={UpdateTicket}>
                Buat Tiket
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ModalTicketGratis = () => {
    return (
      <div
        className={`pt-12 bg-black-opacity h-screen w-full fixed top-0 left-0 right-0 z-40 ${
          type_ticket === "Gratis" ? "" : "hidden"
        }`}
        id="modal-paid-wrapper-all">
        <div className=" bg-white m-auto w-[500px] ">
          <div className="modal-content ">
            <div className="bg-amber-300">
              <div className="px-6 py-3 flex justify-between">
                <h1 className="font-semibold text-lg">Buat Tiket Gratis </h1>
                <button
                  type="button"
                  className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onClick={CloseModal}>
                  <span className="sr-only">Close menu</span>
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="modal-body  overflow-y-scroll h-[400px]">
                <form id="modal-tiket-update">
                  <input
                    type="hidden"
                    name="_token"
                    value="DMxxnV6bJlzMYAytmWo8l0DY70gPF8gr8tUqnzW7"
                  />
                  <div id="wrapper-modal-paid">
                    <div className="border px-3 py-4 rounded mb-3">
                      <div>
                        <div className=" space-y-2 mb-4">
                          <label
                            for="exampleInputEmail1"
                            className="font-semibold ">
                            Nama Tiket
                          </label>
                          <input
                            type="text"
                            className="px-3 py-3 w-full bg-slate-100"
                            id="ticket_name"
                            aria-describedby="emailHelp"
                            placeholder="Masukan Nama Tiket"
                            name="name"
                          />

                          <p
                            className="text-danger my-2"
                            id="name_err"
                            data-element="name"></p>
                        </div>
                        <div className=" space-y-2 mb-4 ">
                          <label className="font-semibold">
                            Masa Penjualan Tiket
                          </label>
                          <div className="flex justify-between items-center gap-1 ">
                            <div>
                              <label
                                htmlFor="ticket_start_at"
                                className="font-semibold text-gray-500 text-sm">
                                Dimulai
                              </label>
                              <input
                                type="datetime-local"
                                id="ticket_start_at"
                                className="px-3 py-3 w-full bg-slate-100"
                                placeholder="Berlaku Dari"
                                name="start_at"
                              />
                              <p
                                id="start_at_err"
                                className="text-danger my-2"></p>
                            </div>

                            <div>
                              <label
                                htmlFor="ticket_end_at"
                                className="font-semibold text-gray-500 text-sm">
                                Berakhir
                              </label>
                              <input
                                type="datetime-local"
                                className="px-3 py-3 w-full bg-slate-100"
                                id="ticket_end_at"
                                placeholder="Berlaku Hingga"
                                name="end_at"
                              />
                              <p
                                id="end_at_err"
                                className="text-danger my-2"></p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <label className="font-semibold">
                          Susun Lokasi Duduk
                        </label>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="col">
                            <input
                              type="text"
                              id="prefix_number"
                              name="prefix_number"
                              className="px-3 py-3 w-full bg-slate-100"
                              placeholder="Jenis Kursi"
                            />
                          </div>

                          <div className="col">
                            <input
                              type="number"
                              className="px-3 py-3 w-full bg-slate-100"
                              id="seat_number_from"
                              placeholder="Dimulai Dari"
                              name="seat_number_from"
                            />
                          </div>

                          <div className="col">
                            <input
                              type="number"
                              className="px-3 py-3 w-full bg-slate-100"
                              id="seat_number_to"
                              placeholder="Sampai Dari"
                              name="seat_number_to"
                              defaultValue={dataTicketView.seat_number_to}
                            />
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400 my-2 text-sm">
                            *Kosongkan apabila event anda tidak memiliki nomor
                            kursi
                          </span>
                          <p
                            id="seat_number_to_err"
                            className="text-danger my-2"></p>
                          <p
                            className="text-danger my-2"
                            id="seat_number_from_err"></p>
                          <p
                            className="text-danger my-2"
                            id="prefix_number_err"></p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <label className="font-semibold">Jumlah Tiket</label>
                        <input
                          type="number"
                          className="px-3 py-3 w-full bg-slate-100"
                          id="qty_ticket"
                          name="qty"
                          placeholder="Jumlah Tiket Yang Tersedia"
                          de
                        />
                        <p
                          className="text-danger my-2"
                          id="qty_err"
                          data-element="qty"></p>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <div className="">
                            <label className="font-semibold">
                              Tiket All Day Pass
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="all-day-pass-checkbox"
                              type="checkbox"
                              defaultChecked={
                                dataTicketView.all_day_pass ? true : false
                              }
                              onChange={e => CheckboxAllDayPass(e)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <span className="text-gray-400 my-2 text-sm">
                          *Aktifkan jika tiket all day pass
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <label
                          for="exampleInputEmail1"
                          className="font-semibold">
                          Harga Tiket
                        </label>
                        <input
                          type=""
                          className="px-3 py-3 w-full bg-slate-100"
                          placeholder="Rp"
                          id="ticket_price"
                          name="price"
                        />
                        <p
                          id="price_err"
                          className="text-danger my-2"
                          data-element="price"></p>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <div className="">
                            <label className="font-semibold">
                              Non Aktifkan Jumlah Tiket
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="disabled-checked-checkbox"
                              name="disable_qty"
                              type="checkbox"
                              defaultChecked={
                                dataTicketView.disable_qty_input ? true : false
                              }
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "
                              onChange={e => CheckboxDisableQtyInput(e)}
                            />
                          </div>
                        </div>
                        <span className="text-gray-400 mt-2 font-base text-sm">
                          *Aktifkan apabila tiket tidak bisa diatur jumlah
                          pembeliannya
                        </span>
                      </div>
                      <div className="space-y-5 mb-4">
                        <div className="flex justify-between">
                          <div className="">
                            <label className="font-semibold">
                              Pengembalian Dana
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="refund-checked-checkbox"
                              type="checkbox"
                              defaultChecked={
                                dataTicketView.refund ? true : false
                              }
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "
                              onChange={e => CheckboxRefund(e)}
                              name="refund"
                            />
                          </div>
                        </div>
                        <span className="text-gray-400 my-2 font-base text-sm">
                          *Aktifkan apabila tiket dapat dilakukan proses
                          pengembalian dana
                        </span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <button
                type="button"
                className="bg-amber-300 py-2 px-5 font-semibold"
                id="v2-edit-ticket"
                data-target="modal-paid-wrapper-all"
                onClick={UpdateTicket}>
                Buat Tiket
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    CallAPi();
  }, []);

  return (
    <>
      <LoadingAnimation click={loading} />
      <ModalTicket />
      <ModalTicketBerbayar />
      <ModalTicketGratis />
      <LayoutPageDashboard>
        <div className="p-5">
          <div class="item-img-wrapper">
            <img id="img-wrapper-events" alt="img-event" fetchpriority="high" />
          </div>

          <div>
            <div className="flex">
              <ul className="grid grid-cols-2 w-full text-center place-content-center py-4">
                <li
                  className={`cursor-pointer ${
                    menuNav === "EVENT KATEGORI"
                      ? "bg-amber-300 py-2 w-full"
                      : ""
                  }`}
                  onClick={MenuNav}
                  data-target="EVENT KATEGORI">
                  <span
                    className="cursor-pointer font-semibold"
                    onClick={MenuNav}
                    data-target="EVENT KATEGORI">
                    EVENT KATEGORI
                  </span>
                </li>
                <li
                  className={` font-semibold ${
                    menuNav === "EVENT DESKRIPSI"
                      ? "bg-amber-300 py-2 w-full"
                      : ""
                  }`}
                  onClick={MenuNav}
                  data-target="EVENT DESKRIPSI">
                  <span
                    onClick={MenuNav}
                    data-target="EVENT DESKRIPSI"
                    className="cursor-pointer font-semibold">
                    EVENT DESKRIPSI
                  </span>
                </li>
              </ul>
            </div>
            <section
              className={`space-y-5 ${
                menuNav !== "EVENT KATEGORI" ? "hidden" : ""
              }`}>
              <input
                type="text"
                id="create-event-name-edit"
                placeholder="Nama Event*"
                maxLength="100"
                spellCheck="false"
                className="px-3 py-3 w-full bg-slate-100"
                name="name"
                defaultValue={detailEvent.name}
              />

              <div className="grid grid-cols-4 justify-between gap-3">
                <div className="shadow px-5 py-2">
                  <div className="">
                    <div className="">
                      <p className="font-semibold">Mulai Jual</p>
                      <span className="text-sm">
                        * Tanggal Event Dimulai Aktifkan
                      </span>
                    </div>
                    <div className="d-lg-flex d-block  my-lg-0 my-md-3 row">
                      <div className="col">
                        <div className="my-2 d-flex">
                          <input
                            type="datetime-local"
                            name="start_selling_date"
                            placeholder="Dari Tanggal"
                            data-target="datetime-local"
                            className="w-full px-3 py-2 bg-slate-100"
                            id="start-selling-date-edit"
                            defaultValue={detailEvent.start_selling_date}
                          />
                        </div>
                        <p
                          id="start_selling_date_edit"
                          className="text-danger text-capitalize"></p>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="">
                      <p className="font-semibold m-0">
                        Tanggal Penjualan Berakhir
                      </p>
                      <span className="text-sm">* Opsional</span>
                    </div>
                    <div className="d-lg-flex d-block  my-lg-0 my-md-3 row">
                      <div className="col">
                        <div className="my-2 d-flex">
                          <input
                            type="datetime-local"
                            name="end_selling_date"
                            placeholder="Non Aktif Event"
                            className="w-full px-3 py-2 bg-slate-100"
                            id="end-selling-date-edit"
                            defaultValue={detailEvent.end_selling_date}
                          />
                        </div>
                        <p
                          id="end_selling_date_edit"
                          className="text-danger text-capitalize"></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="shadow px-5 py-2 space-y-5">
                  <div className="w-100">
                    <p className="font-semibold ">Tanggal &amp; Waktu Event</p>
                    <div className=" d-block  my-lg-0 my-md-3 row space-y-5">
                      <div className="col">
                        <div className="my-2 d-flex">
                          <label>Event Dimulai</label>
                          <input
                            type="datetime-local"
                            name="start_at"
                            placeholder="Dari Tanggal"
                            className="w-full px-3 py-2 bg-slate-100"
                            id="date-event-start-edit"
                            defaultValue={detailEvent.full_start_date}
                          />
                        </div>
                        <p
                          id="start_at_edit"
                          className="text-danger text-capitalize"></p>
                      </div>

                      <div className="col">
                        <div className="my-2 d-flex">
                          <label>Event Berakhir</label>
                          <input
                            type="datetime-local"
                            name="end_at"
                            placeholder="Sampai Tanggal"
                            className="w-full px-3 py-2 bg-slate-100"
                            id="date-event-end-edit"
                            defaultValue={detailEvent.full_end_date}
                          />
                        </div>
                        <p
                          id="end_at_edit"
                          className="text-danger text-capitalize"></p>
                      </div>
                    </div>
                  </div>
                  <div className="w-100">
                    <p className="font-semibold ">Opening Gate</p>
                    <div className="d-block  my-lg-0 my-md-3 row">
                      <div className="col">
                        <div className="my-2 d-flex">
                          <input
                            type="time"
                            name="gate_opening_time"
                            placeholder="Open Gate"
                            className="w-full px-3 py-2 bg-slate-100"
                            id="gate-opening-time-edit"
                            defaultValue={detailEvent.gate_opening_time}
                          />
                        </div>
                        <p
                          id="gate_opening_time_edit"
                          className="text-danger"></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="shadow px-5 py-2">
                  <div className="">
                    <p className="font-semibold ">Detail Lokasi Event</p>
                    <div className="my-lg-0 my-md-3 d-sm-block space-y-5">
                      <div className="my-2">
                        <select
                          className="form-select m-0 bg-slate-100 border w-full py-2"
                          aria-label="Default select example"
                          id="city-value-edit"
                          name="city">
                          <option defaultValue="1">Jakarta Selatan</option>
                          <option defaultValue="2">Jakarta Barat</option>
                          <option defaultValue="3" selected="">
                            Jakarta Pusat
                          </option>
                          <option defaultValue="4">Jakarta Timur</option>
                          <option defaultValue="5">Jakarta Utara</option>
                        </select>

                        <p id="city_edit" className="text-danger"></p>
                      </div>
                      <div className="my-2 d-flex ">
                        <input
                          className="w-full px-3 py-2 bg-slate-100"
                          placeholder="Lokasi"
                          id="venue-edit"
                          name="venue"
                          defaultValue={detailEvent.venue}
                        />
                      </div>
                      <p
                        id="venue_edit"
                        className="text-danger text-capitalize"></p>
                    </div>
                    <div>
                      <div className="my-2">
                        <textarea
                          className="w-full px-3 py-2 bg-slate-100"
                          placeholder="Detail Lokasi"
                          id="address-edit"
                          type="text"
                          name="address"
                          defaultValue={detailEvent.address}></textarea>
                      </div>
                      <p
                        id="address_edit"
                        className="text-danger text-capitalize"></p>
                    </div>
                  </div>
                </div>
                <div className="shadow px-5 py-2 space-y-5">
                  <div className="">
                    <p className="font-semibold">Kategori Tiket</p>
                    <div className="">
                      <div className="my-2">
                        <select
                          className="form-select m-0 bg-slate-100 border w-full py-2"
                          aria-label="Default select example"
                          id="category-events-edit"
                          name="category">
                          <option defaultValue="1">Bursa Kerja</option>
                          <option defaultValue="2" selected="">
                            Musik
                          </option>
                        </select>
                      </div>
                      <p id="category_edit" className="text-danger"></p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Maksimum Tiket</p>
                    <div className="my-2">
                      <div className="d-flex">
                        <input
                          type="text"
                          name="maximum_ticket"
                          placeholder="Maksimum Tiket"
                          className="w-full px-3 py-2 bg-slate-100"
                          id="maximum-ticket-edit"
                          defaultValue={detailEvent.maximum_ticket}
                        />
                      </div>
                      <p
                        id="maximum_ticket_edit"
                        className="text-danger text-capitalize"></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <h1 className="font-semibold text-lg">Jenis Event</h1>
                <div className="flex gap-5 mt-5">
                  <button
                    className="hover:bg-amber-300 px-12 py-2 rounded-full border border-gray-300"
                    onClick={() => setTypeTicket("Berbayar")}>
                    Berbayar
                  </button>
                  <button
                    className="hover:bg-amber-300 px-12 py-2 rounded-full border border-gray-300"
                    onClick={() => setTypeTicket("Gratis")}>
                    Gratis
                  </button>
                </div>
              </div>

              <section>
                <div class="my-lg-4">
                  <h5 class="fw-semibold p">
                    Denah Venue
                    <span class="fs-small text-red-500"> ( opsional )</span>
                  </h5>
                  <span class="text-secondary">
                    Promotor Bisa Mengupload Map
                  </span>
                  <div class="text-center me-3 wrapper-map-img my-3">
                    <img id="sketch_picture_img" alt="file" />
                    <div class="kwt-file">
                      <div class="kwt-file__drop-area">
                        <span class="kwt-file__choose-file ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            fill="currentColor">
                            <path d="M67.508 468.467c-58.005-58.013-58.016-151.92 0-209.943l225.011-225.04c44.643-44.645 117.279-44.645 161.92 0 44.743 44.749 44.753 117.186 0 161.944l-189.465 189.49c-31.41 31.413-82.518 31.412-113.926.001-31.479-31.482-31.49-82.453 0-113.944L311.51 110.491c4.687-4.687 12.286-4.687 16.972 0l16.967 16.971c4.685 4.686 4.685 12.283 0 16.969L184.983 304.917c-12.724 12.724-12.73 33.328 0 46.058 12.696 12.697 33.356 12.699 46.054-.001l189.465-189.489c25.987-25.989 25.994-68.06.001-94.056-25.931-25.934-68.119-25.932-94.049 0l-225.01 225.039c-39.249 39.252-39.258 102.795-.001 142.057 39.285 39.29 102.885 39.287 142.162-.028A739446.174 739446.174 0 0 1 439.497 238.49c4.686-4.687 12.282-4.684 16.969.004l16.967 16.971c4.685 4.686 4.689 12.279.004 16.965a755654.128 755654.128 0 0 0-195.881 195.996c-58.034 58.092-152.004 58.093-210.048.041z">
                              <input
                                id="demo1"
                                class="demo1 kwt-file__input"
                                type="file"
                                multiple=""
                                placeholder="Select Files"
                                name="sketch_picture"
                              />
                            </path>
                          </svg>
                        </span>
                        <input
                          id="demo1"
                          class="demo1 kwt-file__input"
                          type="file"
                          multiple=""
                          placeholder="Select Files"
                          name="sketch_picture"
                        />
                        <span class="kwt-file__msg">Select Files</span>
                        <div class="kwt-file__delete"></div>
                      </div>
                    </div>
                  </div>
                  <p class="text-danger" id="sketch_picture"></p>
                </div>
              </section>

              <section>
                <div className="space-y-3">
                  {dataTicket.map((val, key) => (
                    <div
                      className="ticket-item bg-amber-300 px-5 py-3 space-y-5 rounded-lg border"
                      id={`tiket_item_${val.code}`}
                      data-compoment={key}
                      key={key}>
                      <div className="ticket-item-top">
                        <strong className="ticket-name text-lg">
                          {val.name}
                        </strong>
                        <div className="ticket-schedule space-y-1">
                          <i className="ai ai-clock-filled"></i>
                          <p>
                            Mulai Dijual Tanggal
                            <span className="font-semibold">
                              {" "}
                              {new Date(val.start_at).toLocaleDateString()}
                            </span>{" "}
                            <span className="font-semibold">
                              {" "}
                              - {new Date(val.end_at).toLocaleDateString()}
                            </span>
                          </p>
                          <div className="">
                            <span className="me-3">Qty Tiket {val.qty} </span> |
                            <span className="mx-3">
                              {" "}
                              {val.disable_qty_input > 1
                                ? "Enable Qty Input"
                                : "Disable Qty Input"}
                            </span>{" "}
                            |
                            <span className="mx-3">
                              {" "}
                              {val.refund === true
                                ? "Tiket Bisa Refund "
                                : "Tiket Tidak Bisa Refund"}{" "}
                            </span>{" "}
                            |
                            <span className="ms-3">
                              {" "}
                              {val.prefix_number
                                ? `Kursi ${val.prefix_number} ${val.seat_number_from} - ${val.seat_number_to}`
                                : ""}
                            </span>
                          </div>
                          <p></p>
                        </div>
                      </div>
                      <div className="ticket-item-bottom mt-10">
                        <div className="ticket-price">
                          <div className="ticket-price-main formated-price">
                            <span>
                              {" "}
                              {val.all_day_pass === true
                                ? "All Day Pass"
                                : ""}{" "}
                            </span>
                            <div className="d-flex">
                              <b className="ticket-category-price">
                                <span>
                                  {val.price > 0
                                    ? `RP${new Intl.NumberFormat().format(
                                        val.price
                                      )}`
                                    : "GRATIS"}
                                </span>
                              </b>
                            </div>

                            <div className="d-flex align-items-center mt-3">
                              <div
                                className="me-3 text-center bg-black border border-black text-white px-10 py-2 rounded hover:bg-transparent hover:border-black hover:text-black cursor-pointer"
                                id="btn_edit_7"
                                data-compoment={key}
                                data-element="modal-paid-wrapper-all"
                                data-action="true"
                                onClick={GetTicket}>
                                Edit Tiket
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div>
                  <h1 className="font-semibold text-lg mb-5">
                    {" "}
                    Pengaturan Tambahan
                  </h1>
                </div>
                <div className="grid grid-cols-2">
                  <div className="space-y-3">
                    <div className="grid grid-cols-5 items-center">
                      <div className="col-span-3">
                        <b className="font-semibold ">Maksimum Jumlah Beli Tiket</b>
                        <p>
                          Jumlah maksimum tiket yang dapat dibeli dalam 1
                          transaksi
                        </p>
                      </div>
                      <div>
                        <form class="max-w-sm mx-auto">
                          <label
                            for="countries"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            1
                          </label>
                          <select
                            id="countries"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option selected>1</option>
                            <option value="US">2</option>
                            <option value="CA">3</option>
                            <option value="FR">4</option>
                            <option value="DE">5</option>
                          </select>
                        </form>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 items-center">
                      <div className="col-span-3">
                        <p className="font-semibold ">Tiket More Then One Person</p>
                        <p>
                          Jumlah maksimum tiket yang dapat dibeli dalam 1
                          transaksi
                        </p>
                      </div>
                      <div className="bg-slate-400">
                        <input
                          className="me-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-black/25 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-white after:shadow-switch-2 after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ms-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-switch-1 checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-switch-3 focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ms-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-switch-3 checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-white/25 dark:after:bg-surface-dark dark:checked:bg-primary dark:checked:after:bg-primary"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckDefault01"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-5 items-center">
                      <div className="col-span-3">
                        <p className="font-semibold ">Pesanan Minimum</p>
                        <p>Maksimum pembeliin tiket</p>
                      </div>
                      <div>
                        <form class="max-w-sm mx-auto">
                          <label
                            for="countries"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            1
                          </label>
                          <select
                            id="countries"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option selected>1</option>
                            <option value="US">2</option>
                            <option value="CA">3</option>
                            <option value="FR">4</option>
                            <option value="DE">5</option>
                          </select>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-5 items-center">
                      <div className="col-span-3">
                        <p className="font-semibold ">Biaya Tax</p>
                        <p>
                          Akfifkan jika ingin biaya <b>Tax</b> tiket ditanggung
                          pembeli
                        </p>
                      </div>
                      <div className="bg-slate-400">
                        <input
                          className="me-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-black/25 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-white after:shadow-switch-2 after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ms-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-switch-1 checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-switch-3 focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ms-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-switch-3 checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-white/25 dark:after:bg-surface-dark dark:checked:bg-primary dark:checked:after:bg-primary"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckDefault01"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-5 items-center">
                      <div className="col-span-3">
                        <p>
                          Akfifkan jika ingin biaya <b>Tax</b> tiket ditanggung
                          pembeli
                        </p>
                      </div>
                      <div className="bg-slate-400">
                        <input
                          className="me-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-black/25 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-white after:shadow-switch-2 after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ms-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-switch-1 checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-switch-3 focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ms-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-switch-3 checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-white/25 dark:after:bg-surface-dark dark:checked:bg-primary dark:checked:after:bg-primary"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckDefault01"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </section>

            <section
              className={`space-y-5 ${
                menuNav !== "EVENT DESKRIPSI" ? "hidden" : ""
              }`}>
              <div class="events-category" id="events-category-desciption-edit">
                <div class="my-5">
                  <h5 class="fw-semibold mb-3">Deskripsi Events</h5>
                  <Editor
                    tinymceScriptSrc={
                      process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"
                    }
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={
                      detailEvent.description
                        ? atob(detailEvent.description)
                        : ""
                    }
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "preview",
                        "help",
                        "wordcount"
                      ],
                      toolbar: "undo redo | numlist bullist indent outdent ",
                      branding: false,
                      autosave_restore_when_empty: true
                    }}
                  />

                  <p
                    id="description_edit"
                    class="text-danger my-3 text-capitalize"></p>
                </div>
                <div class="mb-5">
                  <h5 class="fw-semibold mb-3">Informasi Events</h5>
                  <Editor
                    tinymceScriptSrc={
                      process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"
                    }
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={
                      detailEvent.information
                        ? atob(detailEvent.information)
                        : ""
                    }
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "preview",
                        "help",
                        "wordcount"
                      ],
                      toolbar: "undo redo | numlist bullist indent outdent ",
                      branding: false,
                      autosave_restore_when_empty: true
                    }}
                  />

                  <p
                    id="information_edit"
                    class="text-danger my-3 text-capitalize"></p>
                </div>

                <div class="mb-5">
                  <h5 class="fw-semibold mb-3">Syarat dan Ketentuan Events</h5>
                  <Editor
                    tinymceScriptSrc={
                      process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"
                    }
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={
                      detailEvent.term_and_condition
                        ? atob(detailEvent.term_and_condition)
                        : ""
                    }
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "preview",
                        "help",
                        "wordcount"
                      ],
                      toolbar: "undo redo | numlist bullist indent outdent ",
                      branding: false,
                      autosave_restore_when_empty: true
                    }}
                  />
                  <p
                    id="term_and_condition_edit"
                    class="text-danger my-3 text-capitalize"></p>
                </div>
              </div>
            </section>

            <div className="mt-5 flex gap-4">
              <button className="bg-amber-300 py-2 rounded px-8">
                Update Event
              </button>
              <button>
                <Link to={"/dashboard"}>Kembali</Link>
              </button>
            </div>
          </div>
        </div>
      </LayoutPageDashboard>
    </>
  );
};

export default CreateEvent;
