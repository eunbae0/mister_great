import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Main({ isLogin }) {
  const navigate = useNavigate();
  useEffect(() => {
    if(isLogin)
      navigate('/orderHistory');
  })
  return (
    <div className="h-full flex justify-between items-center">
      <button className="w-1/2 mx-4 h-40 p-10 font-bold text-2xl border shadow-lg rounded-2xl">
        <Link to="auth">로그인/회원가입하기</Link>
      </button>
      <button className="w-1/2 mx-4 h-40 p-10 font-bold text-2xl border shadow-lg rounded-2xl">
        <Link to="order">비회원 주문하기</Link>
      </button>
    </div>
  )
}

export default Main;