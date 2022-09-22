import { Link } from 'react-router-dom';

function Main() {
  return (
    <div>
      <button>
        <Link to="auth">로그인/회원가입하기</Link>
      </button>
      <button>
        <Link to="order">비회원 주문하기</Link>
      </button>
    </div>
  )
}

export default Main;