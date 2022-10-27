import { useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.config.js';

import Main from "./Pages/main";
import Auth from "./Pages/auth";
import Order from "./Pages/order";
import OrderHistory from "./Pages/orderHistory";
import Register from "./Pages/register";

const Router = () => {
  // 새로고침시 유저 로그인 여부, 상태 불러오기
  const [isLogin, setIsLogin] = useState(false);
  const [uid, setUid] = useState('');
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUid(user.uid);
      setIsLogin(true); 
    }
    else setIsLogin(false);
  })

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/auth" element={<Auth isLogin={isLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/order" element={<Order isLogin={isLogin} uid={uid} />} />
        <Route path="/orderHistory" element={<OrderHistory isLogin={isLogin} uid={uid} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;