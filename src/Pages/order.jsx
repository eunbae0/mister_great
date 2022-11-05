import { useState } from 'react';

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
  return (
    <div className="h-2/3 w-2/3 mx-auto my-0 flex flex-col items-center justify-center">
      <div className="my-5 p-3 text-2xl text-center font-bold">
        {progressInfoChanger(progress)}
      </div>
      <ProgressBar progress={progress} />
      {progressChanger(progress, setProgress, orderId, setOrderId, isLogin, uid)}
    </div>
  )
}

export default Order;