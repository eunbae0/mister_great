import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useSetRecoilState } from 'recoil'
import { reorder } from '../store';

import { auth, db } from '../firebase.config';
import { signOut } from 'firebase/auth';
import { getDocs, query, collection, where } from 'firebase/firestore';

function OrderBox({ order, isLastOrder }) {
  const navigate = useNavigate();
  const setTodoList = useSetRecoilState(reorder);
  const onClickReOrderBtn = () => {
    const ok = confirm(`${order.menu}디너, ${order.style}스타일, 장소: ${order.place} (으)로 주문을 진행하시겠습니까?`);
    if (ok) {
      setTodoList((prev) => {
        return { ...prev, isReorder: true, menu: order.menu, style: order.style, place: order.place}
      })
      navigate('/order');
    }
  };
  return (
    <div className="my-2 p-3 px-6 flex justify-between items-center shadow-lg rounded-lg">
      <div className="flex flex-col justify-between">
        <span>디너: {order.menu}</span>
        <span>디너 스타일: {order.style}</span>
        <span>장소: {order.place}</span>
      </div>
      <div>
        <span className="mr-4">주문상태: {order.status}</span>
        {isLastOrder && <button className="shadow-md rounded-md border p-2" onClick={onClickReOrderBtn}>이대로 주문하기</button>}
      </div>
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
      <div className="flex h-32 items-center justify-center relative">
        <h2><Link className="p-5 shadow-md text-2xl font-bold rounded-full" to='../order'>음식 주문하기</Link></h2>
        { isLogin &&
          <button className="absolute top-0 right-0" onClick={onClickLogout}>
            Logout
          </button>
        }
      </div>
      <div className="mt-8">
        { isLogin && <h2 className="py-2 text-2xl font-bold">과거 주문목록</h2> }
        {isLoading ? (
          lastOrderArr.map((order) => <OrderBox key={order.oid} order={order} isLastOrder={true}/>)
        ): <span>주문 목록이 없습니다.</span>}
        <h2 className="mt-8 py-2 text-2xl font-bold">주문목록</h2>
        { isLoading ? (
          orderArr.map((order) => <OrderBox key={order.oid} order={order} isLastOrder={false}/>)
        ) : <span>주문 목록이 없습니다.</span>}
      </div>
    </div>
  )
}

export default OrderHistory;