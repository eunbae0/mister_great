import { Link } from 'react-router-dom'

function Auth() {
  return (
    <div>
      {/* 로그인 코드 */}
      <Link to={'../register'}>회원가입하기</Link>
    </div>
  )
}

export default Auth;