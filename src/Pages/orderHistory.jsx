import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useSetRecoilState } from 'recoil'
import { reorder } from '../store';

import { auth, db } from '../firebase.config';
import { signOut } from 'firebase/auth';
import { getDocs, query, collection, where } from 'firebase/firestore';

function OrderBox({ order }) {
  const setTodoList = useSetRecoilState(reorder);
  const onClickReOrderBtn = () => {
    const ok = confirm(`${order.menu}디너, ${order.style}스타일, 장소: ${order.place} 로 주문을 진행하시겠습니까?`);
    if (ok) {
      setTodoList((prev) => {
        return { ...prev, menu: order.menu, style: order.style, place: order.place}
      })
    }
  };
  return (
    <div>
      <span>디너: {order.menu}</span>
      <span>디너 스타일: {order.style}</span>
      <span>장소: {order.place}</span>
      <span>주문상태: {order.status}</span>
      <button onClick={onClickReOrderBtn}>이대로 주문하기</button>
    </div>
  );
}

function OrderHistory({ isLogin, uid }) {
  const initObj = {
    menu: "",
    nonMember: {},
    oid: "",
    place: "",
    status: "",
    style: "",
    time: "",
    uid: "",
  }
  const [orderArr, setOrderArr] = useState([initObj]);
  const [lastOrderArr, setLastOrderArr] = useState([initObj]);
  const [isLoading, setIsLoading] = useState(false);
  const getPostArr = async () => {
    console.log('get')
    setIsLoading(false);
    if (isLogin) {
      const orderDocsSnap = await getDocs(
        query(collection(db, 'Order'), where('uid', '==', uid), where('status', '!=', '배달완료')));
      const p = orderDocsSnap.docs.map((doc) => doc.data());
      setOrderArr(p);

      const lastOrderDocsSnap = await getDocs(
        query(collection(db, 'Order'), where('uid', '==', uid), where('status', '==', '배달완료'))
      );
      const lp = lastOrderDocsSnap.docs.map((doc) => doc.data());
      setLastOrderArr(lp);
      setIsLoading(true);
    } else {
      const orderDocsSnap = await getDocs(
        query(collection(db, 'Order'), where('nonMember', '==', {name: '', password: ''}), where('status', '!=', '배달완료'))
      );
      const p = orderDocsSnap.docs.map((doc) => doc.data());
      setOrderArr(p);
      setIsLoading(true);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      console.log(isLogin)
      getPostArr();
    }, 1500);
  }, [isLogin]); // isLoginLoading 필요

  // 로그아웃
  const navigate = useNavigate();
  const onClickLogout = async () => {
    await signOut(auth);
    navigate('/');
  };
  return (
    <div>
      { isLogin && 
        <button onClick={onClickLogout}>
          Logout
        </button>
      }
      <h2><Link to='../order'>주문하기</Link></h2>
      { isLogin && <h2>과거 주문목록</h2> }
      {isLoading ? (
          lastOrderArr.map((order) => <OrderBox key={order.oid} order={order} />)
      ): <span>주문 목록이 없습니다.</span>}
      <h2>주문목록</h2>
      { isLoading ? (
        orderArr.map((order) => <OrderBox key={order.oid} order={order} />)
      ) : <span>주문 목록이 없습니다.</span>}
    </div>
  )
}

export default OrderHistory;