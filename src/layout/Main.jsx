import React from "react";
import Header from "../components/Main/Shared/Header";
import Footer from "../components/Main/Shared/Footer";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div>
      {/* <Header /> */}
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};

export default Main;
