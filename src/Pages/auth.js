import { Link } from 'react-router-dom'

function Auth() {
  return (
    <div>
      {/* isLogin? <p><Link to={'../login'}>로그인하기</Link></p> */}
      <p><Link to={'../register'}>회원가입하기</Link></p>
    </div>
  )
}

export default Auth;