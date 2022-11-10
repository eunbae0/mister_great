import { useState, useEffect } from 'react';
import { db } from '../../firebase.config';
import { doc, getDocs, updateDoc, query, collection, where } from 'firebase/firestore';


function OrderBox({ order, isComplete, setIsUpdateComplete }) {
  const onChangeOrderStatus = async (e) => {
    const status = e.target.value;
    await updateDoc(doc(db, "Order", order.oid), {
      status: status,
    });
    setIsUpdateComplete((prev) => !prev);
  };

  return (
    <div className="my-2 p-3 px-6 flex justify-between items-center shadow-lg rounded-lg">
      <div className="flex flex-col justify-between">
        <div className="flex flex-col">
          {order.orderList.map(order => 
            <div key={order.orderListId}>
              <span>메뉴: {order.menu}</span>
              <span className="ml-2">스타일: {order.style}</span>
              <span className="ml-2">가격: {order.amount}</span>
              <span className="ml-2">주문 수량: {order.quantity}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col w-32">
        <span className="mr-4">total: ${order.finalAmount}</span>
        <span className="mr-4">장소: {order.place}</span>
      </div>
      <div>
        <span>주문상태: </span>
        { isComplete ? <span className="ml-1">{order.status}</span> : (
          <select value={order.status} onChange={onChangeOrderStatus} className="outline-none">
            <option value="조리중">조리중</option>
            <option value="조리완료">조리완료</option>
            <option value="배달중">배달중</option>
            <option value="배달완료">배달완료</option>
          </select>
        )}
      </div>
    </div>
  )
}

function BrowseOrderList() {
  const initObj = {
    nonMember: {},
    oid: "",
    place: "",
    status: "",
    orderList: [
      {style: "",
      menu: "",}
    ],
    finalAmount: 0,
    time: "",
    uid: "",
  }
  const [orderArr, setOrderArr] = useState([initObj]);
  const [lastOrderArr, setLastOrderArr] = useState([initObj]);
  const [isLoading, setIsLoading] = useState(false);

  const [isUpdateComplete, setIsUpdateComplete] = useState(false);

  const getOrderArr = async () => {
    setIsLoading(false);
      const orderDocsSnap = await getDocs(
        query(collection(db, 'Order'), where('status', '!=', '배달완료')));
      const p = orderDocsSnap.docs.map((doc) => doc.data());
      setOrderArr(p);

      const lastOrderDocsSnap = await getDocs(
        query(collection(db, 'Order'), where('status', '==', '배달완료'))
      );
      const lp = lastOrderDocsSnap.docs.map((doc) => doc.data());
      setLastOrderArr(lp);

      setIsLoading(true);
  };

  useEffect(() => {
    getOrderArr();
  }, [isUpdateComplete]);

  return (
    <div>
      <div className="my-8">
        <h1 className="font-bold text-2xl">진행중인 주문</h1>
        {isLoading && orderArr.map(order => <OrderBox key={order.oid} order={order} isComplete={false} setIsUpdateComplete={setIsUpdateComplete} />)}
      </div>
      <div className="my-8">
        <h1 className="font-bold text-2xl">완료된 주문</h1>
        {isLoading && lastOrderArr.map(order => <OrderBox key={order.oid} order={order} isComplete={true} setIsUpdateComplete={setIsUpdateComplete} />)}
      </div>
    </div>
  )
}

export default BrowseOrderList;