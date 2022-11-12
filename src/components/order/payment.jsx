import { useSetRecoilState } from 'recoil';
import { orderInfoState } from '../../store';
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();
  const setorderInfo = useSetRecoilState(orderInfoState);

  const onSubmitPayment = (e) => {
    e.preventDefault();
    setorderInfo({finalAmount: 0,
      orderList: [{
        menu: '',
        style: '',
        amount: 0,
        orderListId: 0,
        quantity: 0,
      }]})
    alert('결제가 완료되었습니다. 주문이 진행됩니다.');
    navigate('/orderHistory');
    
  };

  return (
    <div className="w-full my-8 px-3"> 
      <form onSubmit={onSubmitPayment}>
        <div className="my-3 flex justify-between items-center">
          <h3 className="text-lg font-bold">카드번호</h3>
          <input required type="text" className="h-8 w-20 ml-40 p-1 outline-none border rounded-md text-center" maxLength="4"/>
          -
          <input required type="text" className="h-8 w-20 p-1 outline-none border rounded-md text-center" maxLength="4"/>
          -
          <input required type="text" className="h-8 w-20 p-1 outline-none border rounded-md text-center" maxLength="4"/>
          -
          <input required type="text" className="h-8 w-20 p-1 outline-none border rounded-md text-center" maxLength="4"/>
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