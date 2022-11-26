import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { orderInfoState } from '../../Store/index';

import ProgressBar from '../../components/order/progressBar'
import SelectDinner from '../../components/order/selectDinner';
import SubmitInfo from '../../components/order/submitInfo';
import Payment from '../../components/order/payment';

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

function OrderBox({order, orderInfo, setOrderInfo, progress}) {
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

  const onClickDeleteBtn = (orderListId) => {
    const orderList = orderInfo.orderList.filter(order => order.orderListId === orderListId)[0];
    const orderListExcept = orderInfo.orderList.filter(order => order.orderListId !== orderListId);
    setOrderInfo((prev) => ({
      ...prev, 
      finalAmount: prev.finalAmount - orderList.amount,
      orderList: [...orderListExcept]
    }))
  }

  return (
    <div className="flex my-1">
      <span>메뉴: {order.menu}</span>
      <span className="ml-2">스타일: {order.style}</span>
      <span className="ml-2">가격: {order.amount}</span>
      <span className="ml-2">주문 수량: </span>
      <input type="number" min="1" value={order.quantity} onChange={e => onChangeOrderQuantity(e, order.orderListId)} className="text-center w-10 outline-none" />
      {progress === 0 && <button onClick={() => onClickDeleteBtn(order.orderListId)} className="px-2 font-bold">X</button>}
    </div>
  )
}

function Order({ isLogin, uid }) {
  const [progress, setProgress] = useState(0);
  const [orderId, setOrderId] = useState('');
  const [orderInfo, setOrderInfo] = useRecoilState(orderInfoState);

  return (
    <div className="h-2/3 w-2/3 mx-auto my-0 flex flex-col items-center justify-center">
      <div className="my-5 p-3 text-2xl text-center font-bold">
        {progressInfoChanger(progress)}
      </div>
      <ProgressBar progress={progress} />
      {progressChanger(progress, setProgress, orderId, setOrderId, isLogin, uid)}
      <h2 className="font-bold text-lg mb-4">주문서</h2>
      {orderInfo.orderList
        .filter((list) => list.orderListId > 0)
        .sort((a, b) => a.orderListId - b.orderListId)
        .map(order => (
        <OrderBox key={order.orderListId} order={order} orderInfo={orderInfo} setOrderInfo={setOrderInfo} progress={progress}/>
      ))}
      <div className="text-lg font-bold mt-4">최종 결제 금액: ${orderInfo.finalAmount}</div>
    </div>
  )
}

export default Order;