import { signOut } from 'firebase/auth';
import { auth } from '../firebase.config';
import { useNavigate } from "react-router-dom";

function OrderHistory({ isLogin }) {
  const navigate = useNavigate();
  // 로그아웃
  const onClickLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div>
      <h3>테스트</h3>
      <button onClick={onClickLogout}>
        Logout
      </button>
      { isLogin && (<h2>과거 주문목록</h2>)}
      <h2>주문목록</h2>
    </div>
  )
}

export default OrderHistory;