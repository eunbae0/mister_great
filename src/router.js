import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./Pages/main";
import Auth from "./Pages/auth";
import Order from "./Pages/order";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;