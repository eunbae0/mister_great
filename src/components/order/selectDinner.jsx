import { useState, useEffect, useRef } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { reorder, orderInfoState } from '../../store';

import { db } from '../../firebase.config';
import { setDoc, doc } from 'firebase/firestore';
import { v4 } from 'uuid';

function totalAmountbyMenuAndStyle(menu, style) {
  let totalAmount = 0;
  switch(menu) {
    case 'valentine': totalAmount += 100; break;
    case 'french': totalAmount += 130; break;
    case 'english': totalAmount += 130; break;
    case 'champagne': totalAmount += 250; break;
    default: totalAmount += 0; 
  }
  switch(style) {
    case 'simple': totalAmount += 0; break;
    case 'grand': totalAmount += 20; break;
    case 'deluxe': totalAmount += 40; break;
  }
  return totalAmount;
}

function SelectDinner({ setProgress, setOrderId, isLogin, uid }) {
  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const menuRef = useRef(null);
  const styleRef = useRef(null);

  const [orderInfo, setOrderInfo] = useRecoilState(orderInfoState);

  const orderListIdRef = useRef(0);
  const onChangeStyleSelect = () => {
    const menu = menuRef.current;
    const style = styleRef.current;
    const totalAmount = totalAmountbyMenuAndStyle(menu.value, style.value);
    orderListIdRef.current += 1;
    setOrderInfo((prev) => ({
      ...prev,
      finalAmount: prev.finalAmount + totalAmount,
      orderList: [...prev.orderList, {menu: menu.value, style: style.value, amount: totalAmount, orderListId: orderListIdRef.current, quantity: 1}]
    }));
    menu.value = '';
    style.value = '';
  };

  const onSubmitSelect = async (e) => {
    e.preventDefault();
    const oid = v4();
    setOrderId(oid);
    if(isLogin) {
      await setDoc(doc(db, "Order", oid), {
        oid,
        orderList: orderInfo.orderList,
        uid,
        nonMember: {},
      });
    } else {
      const name = nameRef.current.value;
      const password = passwordRef.current.value;
      await setDoc(doc(db, "Order", oid), {
        oid,
        orderList: orderInfo.orderList,
        uid: '',
        nonMember: {
          name,
          password,
        }
      });
    }
    setProgress(1);
    // 이 함수는 작성안하셔도 됩니다!
  }

  // 재주문 로직
  const reorderObj = useRecoilValue(reorder);
  useEffect(() => {
    const menu = menuRef.current;
    const style = styleRef.current;
    if (reorderObj.isReorder) {
      menu.value = reorderObj.menu;
      style.value = reorderObj.style;
      setOrderInfo((prev) => {
        return { ...prev, dinnerMenu: reorderObj.menu, dinnerStyle: reorderObj.style};
      }); // 변경하기
    }
  }, [])
  

  return (
    <div className="w-full my-8 px-3">
      <form action="submit" onSubmit={onSubmitSelect}>
        {/* 디너 메뉴 */}
        <div className="my-3 flex justify-between">
          <h3 className="text-lg font-bold">디너 메뉴</h3>
          <select ref={menuRef} name="menu" className="outline-none">
            <option value="">--디너 메뉴를 선택하세요--</option>
            <option value="valentine">Valentine dinner ($100)</option>
            <option value="french">French dinner ($130)</option>
            <option value="english">English dinner ($130)</option>
            <option value="champagne">Champagne Feast dinner ($250)</option>
          </select>
        </div>
        {/* 디너 스타일 */}
        <div className="my-3 flex justify-between">
          <h3 className="text-lg font-bold">디너 스타일</h3>
          <select ref={styleRef} name="style" onChange={onChangeStyleSelect} className="outline-none">
            <option value="">--디너 스타일을 선택하세요--</option>
            <option value="simple">Simple</option>
            <option value="grand">Grand (+ $20)</option>
            <option value="deluxe">Deluxe (+ $40)</option>
          </select>
        </div>
        { !isLogin && (
          <div className="my-8">
            <h3 className="text-xl font-bold text-center">비회원 주문을 위해 이름과 비밀번호를 입력해주세요</h3>
            <div className="mt-4 flex justify-end items-center">
              <input type="text" placeholder="이름" ref={nameRef} className="w-28 border-b-2 text-center outline-none"/>
              <input type="password" placeholder="비밀번호" ref={passwordRef} className="ml-3 border-b-2 text-center outline-none"/>
            </div>
          </div>
        )}
        <div className="mt-8 text-right">
          <button type="submit" className="font-bold p-3 px-5 rounded-full shadow-lg border">
            다음 단계
          </button>
        </div>
      </form>
    </div>
  )
}

export default SelectDinner;