import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Main({ isLogin }) {
  const navigate = useNavigate();
  useEffect(() => {
    if(isLogin)
      navigate('/orderHistory');
  })
  return (
    <div>
      <button className="p-3 ">
        <Link to="auth">로그인/회원가입하기</Link>
      </button>
      <button>
        <Link to="order">비회원 주문하기</Link>
      </button>
    </div>
  )
}

export default Main;