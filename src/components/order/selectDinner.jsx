import { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { reorder } from '../../store';

import { db } from '../../firebase.config';
import { setDoc, doc } from 'firebase/firestore';
import { v4 } from 'uuid';

function SelectDinner({ setProgress, setOrderId, isLogin, uid }) {
  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const menuRef = useRef(null);
  const styleRef = useRef(null);

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
    if(obj.dinnerMenu == '' || obj.dinnerStyle == '') {
      alert('정보를 모두 입력하세요');
      return;
    }
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

  const reorderObj = useRecoilValue(reorder);
  useEffect(() => {
    console.log(reorderObj)
    const menu = menuRef.current;
    const style = styleRef.current;
    if (reorderObj.isReorder) {
      menu.value = reorderObj.menu;
      style.value = reorderObj.style;
      setObj((prev) => {
        return { ...prev, dinnerMenu: reorderObj.menu, dinnerStyle: reorderObj.style};
      });
    }
  }, [])
  

  return (
    <div className="w-full my-8 px-3">
      <form action="submit" onSubmit={onSubmitSelect}>
        {/* 디너 메뉴 */}
        <div className="my-3 flex justify-between">
          <h3 className="text-lg font-bold">디너 메뉴</h3>
          <select ref={menuRef} name="menu" onChange={onChangeSelect} className="outline-none">
            <option value="">--디너 메뉴를 선택하세요--</option>
            <option value="valentine">Valentine dinner</option>
            <option value="french">French dinner</option>
            <option value="english">English dinner</option>
            <option value="champagne">Champagne Feast dinner</option>
          </select>
        </div>
        {/* 디너 스타일 */}
        <div className="my-3 flex justify-between">
          <h3 className="text-lg font-bold">디너 스타일</h3>
          <select ref={styleRef} name="style" onChange={onChangeSelect} className="outline-none">
            <option value="">--디너 스타일을 선택하세요--</option>
            <option value="simple">Simple</option>
            <option value="grand">Grand</option>
            <option value="deluex">Deluxe</option>
          </select>
        </div>
        { !isLogin && (
          <div>
            <h3>비회원 주문을 위해 이름과 비밀번호를 입력해주세요</h3>
            <input type="text" placeholder="이름" ref={nameRef}/>
            <input type="password" placeholder="비밀번호" ref={passwordRef} />
          </div>
        )}
        <div className="mt-8 text-right">
          <button type="submit" className="font-bold p-3 px-5 rounded-full shadow-lg border">
            다음 단계
          </button>
        </div>
      </form>
    </div>
  )
}

export default SelectDinner;