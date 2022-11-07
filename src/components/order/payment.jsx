import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();
  // useState
  const onChangePayment = () => {
    
  };

  const onSubmitPayment = (e) => {
    e.preventDefault();
    alert('결제가 완료되었습니다. 주문이 진행됩니다.');
    navigate('/orderHistory');
    // 이 함수는 작성안하셔도 됩니다!
  };

  return (
    <div className="w-full my-8 px-3"> 
      <form onSubmit={onSubmitPayment}>
        <div className="my-3 flex justify-between items-center">
          <h3 className="text-lg font-bold">카드번호</h3>
          <input required type="text" className="h-8 w-20 ml-40 p-1 outline-none border rounded-md text-center"/>
          -
          <input required type="text" className="h-8 w-20 p-1 outline-none border rounded-md text-center"/>
          -
          <input required type="text" className="h-8 w-20 p-1 outline-none border rounded-md text-center"/>
          -
          <input required type="text" className="h-8 w-20 p-1 outline-none border rounded-md text-center"/>
        </div>
        <div className="mt-8 text-right">
          <button type="submit" className="font-bold p-3 px-5 rounded-full shadow-lg border">
            주문 완료
          </button>
        </div>
      </form>
    </div>
  )
}

export default Payment;