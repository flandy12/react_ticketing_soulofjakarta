import Navbar from "../compoments/navbar";
import { Link, NavLink, Navigate } from "react-router-dom";
import {useEffect, useState} from 'react';
import { CallApi, GetKey } from "../../helper/Api";
import ReactPaginate from 'react-paginate';
import '../css/dashboard.css';
import NavbarDashboard from "./compoment/navbar";

const LayoutPageDashboard = ({ children }) => {
  return (
    <>
      <div>
        <div className="grid grid-cols-12 h-screen">
            <NavbarDashboard/>
            <div className="col-span-10 mx-5">
              {children}
            </div>
        </div>
      </div>
    </>
  )
}

export default LayoutPageDashboard;
