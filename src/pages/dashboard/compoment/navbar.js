import { Link } from "react-router-dom";

const NavbarDashboard = () => {
  return (
    <div className="col-span-2 shadow ">
      <ul className="flex flex-col space-y-2 p-5">
        <li className="border-b-2 border-black mb-5">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="/images/icon/souja-logo5.png"
              className="h-12"
              alt="Logo"
            />
          </Link>
        </li>
        <li>
          <strong className="block text-xs font-medium uppercase text-gray-400">
            {" "}
            General{" "}
          </strong>
          <ul className="mt-2 space-y-1">
            <li>
              <Link
                to="/dashboard"
                className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                Event Saya
              </Link>
            </li>

            <li>
              <Link
                to="/dashboard/referral-code"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                Kode Referral
              </Link>
            </li>

          </ul>
        </li>

        <li>
          <strong className="block text-xs font-medium uppercase text-gray-400">
            TRANSAKSI
          </strong>

          <ul className="mt-2 space-y-1">
            <li>
              <Link
                to="/dashboard/transaction"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                Transaksi
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/revenue/report"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                With Draw
              </Link>
            </li>
          </ul>
        </li>

        <li>
          <strong className="block text-xs font-medium uppercase text-gray-400">
            LAPORAN TIKET
          </strong>

          <ul className="mt-2 space-y-1">
            <li>
              <Link
                to="/dashboard/revenue/report"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                Pendapatan
              </Link>
            </li>
          </ul>
        </li>

        <li>
          <strong className="block text-xs font-medium uppercase text-gray-400">
            {" "}
            Profile{" "}
          </strong>
          <ul className="mt-2 space-y-1">
            <li>
              <Link
                to="/dashboard/profile"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                Infromasi Dasar
              </Link>
            </li>

            <li>
              <Link
                to="#"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                Kata Sandi
              </Link>
            </li>

            <li>
              <form action="#">
                <button
                  type="submit"
                  className="block w-full rounded-lg px-4 py-2 text-sm font-medium text-red-500 [text-align:_inherit] hover:bg-red-100 hover:text-gray-700">
                  Logout
                </button>
              </form>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default NavbarDashboard;
