import { 
    Link,
    useNavigate,
} from 'react-router-dom';
import React, { useState } from "react";
import { 
    signInWithEmailAndPassword, //로그인
} from "firebase/auth";
import { auth } from "../firebase.config";
import { useEffect } from 'react';

function Auth({isLogin, isEmployee}) {
  const navigate = useNavigate(); // 로그인/아웃 완료시 메인페이지로 이동하기위한 훅 선언
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 로그인 입력 변경 시 동작
  const onChange = (event) => {
    const {target: {name, value}} = event;
    if (name==='email') {
      setEmail(value)
    } else if (name === "password") {
      setPassword(value);
    }
  }

  // 로그인 제출 시 동작
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        alert('이메일을 확인해주세요');
        return;
      }
      if (err.code === 'auth/wrong-password') {
        alert('비밀번호를 확인해주세요');
        return;
      }
      return err.message.replace("Firebase: Error ", "");
    }
    if(!isEmployee) {
      navigate('/auth');
    } else {
      navigate('/management');
    }
  }

  useEffect(() => {
    if(isLogin)
      navigate('/orderHistory');
  }, [isLogin, navigate])

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="h-96 w-1/2 bg-gray-100 py-20 rounded-md">
        <form onSubmit={onSubmit} className="h-full flex flex-col justify-between items-center">
          <input
            className="w-2/3 outline-none p-2"
            onChange={onChange}
            type="email"
            name="email"
            value={email}
            placeholder="이메일을 입력하세요"
            />
          <input
            className="w-2/3 outline-none p-2"
            onChange={onChange}
            type="password"
            name="password"
            value={password}
            placeholder="비밀번호를 입력하세요"
          />
          <button 
            type="submit"
            className="w-32 p-2 rounded-md shadow border bg-white"
          >
            로그인
          </button>
          {!isEmployee && (<p>
            <span>아직 회원이 아니신가요?</span>
            <Link to={'../register'} className="ml-2 text-red-500 font-bold">회원가입</Link>
          </p>)}
        </form>
      </div>
    </div>
  )
}

export default Auth;