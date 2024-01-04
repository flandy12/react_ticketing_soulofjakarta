

import { useDispatch, useSelector } from "react-redux";

// import { tambah, kurang } from "./Redux/Action/IniSiaction";

import { peserta1, peserta2, peserta3 } from "./../redux/actions/voting";

function ShopingChart() {
  // const tampilandata = useSelector((state) => state.IniSireducer);
  const poinpeserta = useSelector((state) => state.VotingReducer);
  const dispatch = useDispatch();
  return (
    <div className="App">
      {/* ini pelajaran pertama */}
      {/* <div>{tampilandata.nilai}</div>
      <div>
        <button onClick={() => dispatch(tambah())}>Tambah</button>
        <button onClick={() => dispatch(kurang())}>Kurang</button>
      </div> */}
      {/* ini pelajaran ke 2 */}

      <div>
        Peserta 1 <br />
        {poinpeserta.peserta1}
        <br />
        <button onClick={() => dispatch(peserta1())}>Vote peserta 1</button>
      </div>
      <div>
        Peserta 2 <br />
        {poinpeserta.peserta2}
        <br />
        <button onClick={() => dispatch(peserta2())}>Vote peserta 2</button>
      </div>
      <div>
        Peserta 3 <br />
        {poinpeserta.peserta3}
        <br />
        <button onClick={() => dispatch(peserta3())}>Vote peserta 3</button>
      </div>

      <div>
        Total suara :{" "}
        {poinpeserta.peserta1 + poinpeserta.peserta2 + poinpeserta.peserta3}
      </div>
    </div>
  );
}

export default ShopingChart;