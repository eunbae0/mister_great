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
      <Link to="auth" className="w-1/2 mx-4 h-40 flex justify-center items-center font-bold text-2xl border shadow-lg rounded-2xl">
        <button className="">
          로그인/회원가입하기
        </button>
      </Link>
      <Link to="order" className="w-1/2 mx-4 h-40 flex justify-center items-center font-bold text-2xl border shadow-lg rounded-2xl">
      <button className="">
        비회원 주문하기
      </button>
      </Link>
    </div>
  )
}

export default Main;