import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();
  // useState
  
  const onChangePayment = () => {
    
  };

  const onSubmitPayment = (e) => {
    e.preventDefault();
    navigate('/orderHistory');
    // 이 함수는 작성안하셔도 됩니다!
  };

  return (
    <div>      
      <form onSubmit={onSubmitPayment}>
        <input
          onChange={onChangePayment}
          type="text"
          placeholder="카드번호"
        />
        <button type="submit">
          주문 완료
        </button>
      </form>
    </div>
  )
}

export default Payment;