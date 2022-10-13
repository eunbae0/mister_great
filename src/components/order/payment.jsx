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
    <div>      
      <form onSubmit={onSubmitPayment}>
        <h3>카드번호</h3>
        <input
          // onChange={onChangePayment}
          type="text"
        />
        -
        <input
          // onChange={onChangePayment}
          type="text"
          />
        -
        <input
          // onChange={onChangePayment}
          type="text"
          />
        -
        <input
          // onChange={onChangePayment}
          type="text"
        />
        <button type="submit">
          주문 완료
        </button>
      </form>
    </div>
  )
}

export default Payment;