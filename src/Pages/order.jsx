import { useState } from 'react';

import ProgressBar from '../components/order/progressBar'
import SelectDinner from '../components/order/selectDinner';
import SubmitInfo from '../components/order/submitInfo';
import Payment from '../components/order/payment';

import '../Styles/order.css';

function progressChanger (progress, setProgress) {
  switch (progress) {
    case progress === 0:
      return <SelectDinner setProgress={setProgress} />;
    case progress === 1:
      return <SubmitInfo setProgress={setProgress} />;
    case progress === 2:
      return <Payment setProgress={setProgress} />;
    default:
      return <SelectDinner setProgress={setProgress} />;
  }
}

function Order() {
  const [progress, setProgress] = useState(0);
  return (
    <div>
      <ProgressBar progress={progress} />
      {progressChanger(progress, setProgress)}
    </div>
  )
}

export default Order;