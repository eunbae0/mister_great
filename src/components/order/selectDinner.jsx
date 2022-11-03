import { useState, useRef } from 'react';
import { db } from '../../firebase.config';
import { setDoc, doc } from 'firebase/firestore';
import { v4 } from 'uuid';

function SelectDinner({ setProgress, setOrderId, isLogin, uid }) {
  const nameRef = useRef(null);
  const passwordRef = useRef(null);

  const dinnerObject = { 
    dinnerMenu: '',
    dinnerStyle: '',
  };
  const [obj, setObj] = useState(dinnerObject);

  const onChangeSelect = (e) => {
    // ../Pages/register.jsx 파일 참고해서 작성해주세요
    const name = e.target.name;
    if (name === 'menu') {
      setObj((prev) => {
        return { ...prev, dinnerMenu: e.target.value};
      });
    }
    else if (name === 'style') {
      setObj((prev) => {
        return { ...prev, dinnerStyle: e.target.value};
      });
    } else {
      console.log('error');
    }
  };

  const onSubmitSelect = async (e) => {
    e.preventDefault();
    const oid = v4();
    setOrderId(oid);
    if(isLogin) {
      await setDoc(doc(db, "Order", oid), {
        oid,
        menu: obj.dinnerMenu,
        style: obj.dinnerStyle,
        uid,
        nonMember: {},
      });
    } else {
      const name = nameRef.current.value;
      const password = passwordRef.current.value;
      await setDoc(doc(db, "Order", oid), {
        oid,
        menu: obj.dinnerMenu,
        style: obj.dinnerStyle,
        uid: '',
        nonMember: {
          name,
          password,
        }
      });
    }
    setProgress(1);
    // 이 함수는 작성안하셔도 됩니다!
  }

  return (
    <div>
      <form action="submit" onSubmit={onSubmitSelect}>
        {/* 디너 메뉴 */}
        <select name="menu" onChange={onChangeSelect}>
          <option value="">--디너 메뉴를 선택하세요--</option>
          <option value="valentine">Valentine dinner</option>
          <option value="french">French dinner</option>
          <option value="english">English dinner</option>
          <option value="champagne">Champagne Feast dinner</option>
        </select>
        {/* 디너 스타일 */}
        <select name="style" onChange={onChangeSelect}>
          <option value="">--디너 스타일을 선택하세요--</option>
          <option value="simple">Simple</option>
          <option value="grand">Grand</option>
          <option value="deluex">Deluxe</option>
        </select>
        { !isLogin && (
          <div>
            <h3>비회원 주문을 위해 이름과 비밀번호를 입력해주세요</h3>
            <input type="text" placeholder="이름" ref={nameRef}/>
            <input type="password" placeholder="비밀번호" ref={passwordRef} />
          </div>
        )}
        <button type="submit">
          다음 단계
        </button>
      </form>
    </div>
  )
}

export default SelectDinner;