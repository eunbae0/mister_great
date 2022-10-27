import { useState } from 'react';

import ProgressBar from '../components/order/progressBar'
import SelectDinner from '../components/order/selectDinner';
import SubmitInfo from '../components/order/submitInfo';
import Payment from '../components/order/payment';

import '../Styles/order.css';

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
    <div>
      <ProgressBar progress={progress} />
      {progressChanger(progress, setProgress, orderId, setOrderId, isLogin, uid)}
    </div>
  )
}

export default Order;