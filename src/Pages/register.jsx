import { useRef } from "react";
import { auth, db } from "../firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Auth() {
  const inputEmailRef = useRef(null);
  const inputPasswordRef = useRef(null);
  const inputNameRef = useRef(null);
  const inputAddressRef = useRef(null);
  const navigate = useNavigate(); // 회원가입 완료시 메인페이지로 이동하기위한 훅 선언

  // useState Init Object
  // const authInitObj = {
  //   email: '',
  //   password: '',
  // }
  // const [authObj, setAuthObj] = useState(authInitObj)

  // 회원가입 입력(input) 변경시 동작
  // const onChangeAuth = (e) => {
  //   const type = e.target.type; // input에서 지정해준 type정보
  //   if (type === 'email') {
  //     setAuthObj((prev) => {
  //       return { ...prev, email: e.target.value};
  //     });
  //   }
  //   else if (type === 'password') {
  //     setAuthObj((prev) => {
  //       return { ...prev, password: e.target.value};
  //     });
  //   } else {
  //     console.log('error');
  //   }
  // }

  // 회원가입정보 제출시 동작
  const onSubmitAuth = (e) => {
    e.preventDefault();
    const email = inputEmailRef.current.value;
    const password = inputPasswordRef.current.value;
    const name = inputNameRef.current.value;
    const address = inputAddressRef.current.value;

    if (email === '' || password === '' || name === '' || address === '') {
      alert('회원가입 정보를 모두 입력해주세요');
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const { uid } = userCredential.user;
        await setDoc(doc(db, 'User', uid), {
          uid,
          email,
          name,
          address,
        });
        alert('회원가입 되었습니다');
        navigate('/orderHistory');
        // 회원가입시 자동으로 로그인 상태로 변경됩니다. 이후 주문목록페이지로 리다이렉트 합니다.
      })
      .catch((err) => {
        console.log(err.code, ',', err.message); // 에러발생시 콘솔에 출력
      });
  };
  return (
    <div>
      <form onSubmit={onSubmitAuth} className="flex flex-col">
        <input
          ref={inputEmailRef}
          type="email"
          placeholder="이메일을 입력하세요"
          />
        <input
          ref={inputPasswordRef}
          type="password"
          placeholder="비밀번호를 입력하세요"
        />
        <input
          ref={inputNameRef}
          type="text"
          placeholder="이름"
          />
        <input
          ref={inputAddressRef}
          type="text"
          placeholder="주소"
        />
        <button type="submit">
          회원가입하기
        </button>
      </form>
    </div>
  )
}

export default Auth;