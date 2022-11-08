import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { orderInfoState } from '../store';

import ProgressBar from '../components/order/progressBar'
import SelectDinner from '../components/order/selectDinner';
import SubmitInfo from '../components/order/submitInfo';
import Payment from '../components/order/payment';

function progressInfoChanger (progress) {
  switch (progress) {
    case 0:
      return '디너 종류와 스타일 선택';
    case 1:
      return '배달 시간과 장소 선택';
    case 2:
      return '결제하기';
    default:
      return '';
  }
}

function progressChanger (progress, setProgress, orderId, setOrderId, isLogin, uid) {
  switch (progress) {
    case 0:
      return <SelectDinner setProgress={setProgress} setOrderId={setOrderId} isLogin={isLogin} uid={uid} />;
    case 1:
      return <SubmitInfo setProgress={setProgress} orderId={orderId} />;
    case 2:
      return <Payment />;
    default:
      return <SelectDinner setProgress={setProgress} setOrderId={setOrderId} />;
  }
}

function Order({ isLogin, uid }) {
  const [progress, setProgress] = useState(0);
  const [orderId, setOrderId] = useState('');
  const [orderInfo, setOrderInfo] = useRecoilState(orderInfoState);

  const onChangeOrderQuantity = (e, orderListId) => {
    const num = e.target.value;
    const orderList = orderInfo.orderList.filter(order => order.orderListId === orderListId)[0];
    const initAmount = orderList.amount / orderList.quantity;
    const newOrderList = {...orderList, quantity: num, amount: initAmount * num}
    const orderListExcept = orderInfo.orderList.filter(order => order.orderListId !== orderListId);

    setOrderInfo((prev) => ({
      ...prev, 
      finalAmount: prev.finalAmount - orderList.amount + initAmount * num,
      orderList: [...orderListExcept, newOrderList]
    }))
  }

  return (
    <div className="h-2/3 w-2/3 mx-auto my-0 flex flex-col items-center justify-center">
      <div className="my-5 p-3 text-2xl text-center font-bold">
        {progressInfoChanger(progress)}
      </div>
      <ProgressBar progress={progress} />
      {progressChanger(progress, setProgress, orderId, setOrderId, isLogin, uid)}
      <h2>주문 내역</h2>
      {orderInfo.orderList.map(order => (
        <div key={order.orderListId}>
          <span>메뉴: {order.menu}</span>
          <span>스타일: {order.style}</span>
          <span>가격: {order.amount}</span>
          <span>주문 수량: </span>
          <input type="number" min="1" value={order.quantity} onChange={e => onChangeOrderQuantity(e, order.orderListId)} className="text-center w-10 outline-none" />
        </div>
      ))}
      <div className="text-lg font-bold">최종 결제 금액: ${orderInfo.finalAmount}</div>
    </div>
  )
}

export default Order;