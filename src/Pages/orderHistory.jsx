import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { reorderState, nonMemberInfo } from '../store';

import { auth, db } from '../firebase.config';
import { signOut } from 'firebase/auth';
import { getDocs, query, collection, where } from 'firebase/firestore';

function OrderBox({ order, isLastOrder }) {
  const navigate = useNavigate();
  const setReorderList = useSetRecoilState(reorderState);
  const onClickReOrderBtn = () => {
    const ok = confirm(`주문 장소: ${order.place} (으)로 주문을 진행하시겠습니까?`);
    if (ok) {
      setReorderList((prev) => {
        return { ...prev, isReorder: true, reorderList: order.orderList, reorderFinalAmount: order.finalAmount, place: order.place}
      })
      navigate('/order');
    }
  };
  return (
    <div className="my-2 p-3 px-6 flex justify-between items-center shadow-lg rounded-lg">
      <div className="flex flex-col justify-between">
        <div className="flex flex-col">
          {order.orderList.map(order => 
            <div key={order.orderListId}>
              <span>메뉴: {order.menu}</span>
              <span className="ml-2">스타일: {order.style}</span>
              <span className="ml-2">가격: {order.amount}</span>
              <span className="ml-2">주문 수량: {order.quantity}</span>
            </div>
          )}
        </div>
      </div>

        <div className="flex flex-col w-32">
          <span className="mr-4">total: ${order.finalAmount}</span>
          <span className="mr-4">장소: {order.place}</span>
        </div>
        <span className="mr-4">주문상태: {order.status}</span>
        {isLastOrder && <button className="shadow-md rounded-md border p-2" onClick={onClickReOrderBtn}>이대로 주문하기</button>}

    </div>
  );
}

function NonMemberLogin() {
  const nonMemberNameRef = useRef(null);
  const nonMemberPwRef = useRef(null);
  const setNonMemberInfo = useSetRecoilState(nonMemberInfo);

  const onSubmitNonMemberLogin = async (e) => {
    e.preventDefault();
    const name = nonMemberNameRef.current.value;
    const password = nonMemberPwRef.current.value;
    const nonMemberDocsSnap = await getDocs(
      query(collection(db, 'Order'), where('nonMember', '==', {name, password}), where('status', '!=', '배달완료'))
    );
    console.log(nonMemberDocsSnap.empty);
    if(nonMemberDocsSnap.empty)
      alert('주문 정보가 없습니다.');
    else {
      setNonMemberInfo((prev) => {
        return { ...prev, isNonMemberLogin: true, nonMemberInfo: {name, password}}
      })
    }
  };
  return (
    <div className="mt-16">
      <form onSubmit={onSubmitNonMemberLogin} className="h-full flex flex-col justify-between items-center">
        <h3 className="text-xl font-bold">주문시 제출한 이름과 비밀번호를 입력해주세요</h3>
        <div className="flex mt-8">
          <input
            className="w-28 border-b-2 text-center outline-none p-1"
            type="text"
            ref={nonMemberNameRef}
            placeholder="이름"
            required
            />
          <input
            className="ml-3 w-40 border-b-2 text-center outline-none p-1"
            type="password"
            ref={nonMemberPwRef}
            placeholder="비밀번호"
            required
          />
          <button type="submit" className="ml-3 w-16 font-bold p-1 rounded-full shadow-md">제출</button>
        </div>
      </form>
    </div>
  )
}

function OrderHistory({ isLogin, uid }) {
  const initObj = {
    nonMember: {},
    oid: "",
    place: "",
    status: "",
    orderList: [
      {style: "",
      menu: "",}
    ],
    finalAmount: 0,
    time: "",
    uid: "",
  }
  const [orderArr, setOrderArr] = useState([initObj]);
  const [lastOrderArr, setLastOrderArr] = useState([initObj]);
  const [isLoading, setIsLoading] = useState(false);

  // 비회원
  const nonMemberInfoObj = useRecoilValue(nonMemberInfo)

  const getOrderArr = async () => {
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
        query(collection(db, 'Order'), where('nonMember', '==', nonMemberInfoObj.nonMemberInfo), where('status', '!=', '배달완료'))
      );
      const p = orderDocsSnap.docs.map((doc) => doc.data());
      setOrderArr(p);
      setIsLoading(true);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      getOrderArr();
    }, 1500);
  }, [isLogin, nonMemberInfoObj]); // isLoginLoading 필요

  // 로그아웃
  const navigate = useNavigate();
  const onClickLogout = async () => {
    await signOut(auth);
    navigate('/');
    location.reload();
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
      { !(isLogin || nonMemberInfoObj.isNonMemberLogin) ? <NonMemberLogin /> : (
        <div className="mt-8">
          { isLogin && (
            <div>
              { isLogin && <h2 className="py-2 text-2xl font-bold">과거 주문목록</h2> }
              {isLoading ? (
                lastOrderArr.map((order) => <OrderBox key={order.oid} order={order} isLastOrder={true}/>)
              ): <span>주문 목록이 없습니다.</span>}
            </div>
          )}
          <div className="mt-8 pb-10">
            <div className="flex justify-between">
              <h2 className="py-2 text-2xl font-bold">주문목록</h2>
              {!(isLogin || nonMemberInfoObj.isNonMemberLogin) && <button onClick={() => location.reload()} className="px-4 text-md font-bold shadow-md rounded-full">비회원 주문 재검색</button>}
            </div>
            { isLoading ? (
              orderArr.map((order) => <OrderBox key={order.oid} order={order} isLastOrder={false}/>)
            ) : <span>주문 목록이 없습니다.</span>}
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderHistory;