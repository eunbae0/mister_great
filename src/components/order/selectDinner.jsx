import { useState, useEffect, useRef } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { reorderState, orderInfoState } from '../../Store/index';

import { db } from '../../firebase.config';
import { setDoc, doc } from 'firebase/firestore';
import { v4 } from 'uuid';

function totalAmountbyMenuAndStyle(menu, style) {
  let totalAmount = 0;
  switch(menu) {
    case 'valentine': totalAmount += 100; break;
    case 'french': totalAmount += 130; break;
    case 'english': totalAmount += 130; break;
    case 'champagne': totalAmount += 250; break;
    default: totalAmount += 0; 
  }
  switch(style) {
    case 'simple': totalAmount += 0; break;
    case 'grand': totalAmount += 20; break;
    case 'deluxe': totalAmount += 40; break;
  }
  return totalAmount;
}

function SelectDinner({ setProgress, setOrderId, isLogin, uid }) {
  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const menuRef = useRef(null);
  const styleRef = useRef(null);

  const [orderInfo, setOrderInfo] = useRecoilState(orderInfoState);

  // 순차선택 로직
  const [isSelectedMenu, setIsSelectedMenu] = useState(false);
  const onChangeMenuSelect = () => {
    setIsSelectedMenu(true);
  }
  useEffect(() => {
    const style = styleRef.current;
    if(isSelectedMenu) style.disabled = false;
    else style.disabled = true;
  }, [isSelectedMenu]);

  // 주문목록 업데이트
  const orderListIdRef = useRef(0);
  const onChangeStyleSelect = () => {
    const menu = menuRef.current;
    const style = styleRef.current;
    const totalAmount = totalAmountbyMenuAndStyle(menu.value, style.value);

    const sameOrder = orderInfo.orderList.filter(order => order.menu === menu.value && order.style === style.value)
    if(sameOrder.length === 0) {
      orderListIdRef.current += 1;
      const newOrder = {
        menu: menu.value, 
        style: style.value, 
        amount: totalAmount, 
        orderListId: orderListIdRef.current, 
        quantity: 1
      };
      setOrderInfo((prev) => ({
        ...prev,
        finalAmount: prev.finalAmount + totalAmount,
        orderList: [...prev.orderList, newOrder]
      }));
    } else {
      const newSameOrder = {...sameOrder[0], quantity: parseInt(sameOrder[0].quantity) + 1, amount: sameOrder[0].amount + totalAmount}
      const orderListExcept = orderInfo.orderList.filter(order => order.orderListId !== sameOrder[0].orderListId);
      
      setOrderInfo((prev) => ({
        ...prev, 
        finalAmount: prev.finalAmount + totalAmount,
        orderList: [...orderListExcept, newSameOrder]
      }))
    }
    setIsSelectedMenu(false);
    menu.value = '';
    style.value = '';
  };


  const onSubmitSelect = async (e) => {
    e.preventDefault();
    if(orderInfo.finalAmount === 0) {
      alert('주문을 진행해주세요')
      return;
    }
    const oid = v4();
    setOrderId(oid);
    const submitOrderInfo = orderInfo.orderList.filter((list) => list.orderListId > 0)
    if(isLogin) {
      await setDoc(doc(db, "Order", oid), {
        oid,
        orderList: submitOrderInfo,
        finalAmount: orderInfo.finalAmount,
        uid,
        nonMember: {},
      });
    } else {
      const name = nameRef.current.value;
      const password = passwordRef.current.value;
      await setDoc(doc(db, "Order", oid), {
        oid,
        orderList: submitOrderInfo,
        finalAmount: orderInfo.finalAmount,
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

  // 재주문 로직
  const reorder = useRecoilValue(reorderState);
  useEffect(() => {
    if (reorder.isReorder) {
      setOrderInfo((prev) => ({
        ...prev,
        finalAmount: reorder.reorderFinalAmount,
        orderList: reorder.reorderList,
      }));
    }
  }, [])

  // 음성인식 로직
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState();
  // 녹음 데이터 저장 배열
  const audioArray = [];
  const onClickAudioBtn = async (event) => {
      if(!isRecording){
        // 마이크 mediaStream 생성: Promise를 반환하므로 async/await 사용
        const mediaStream = await navigator.mediaDevices.getUserMedia({audio: true});
        const mediaRecorder = new MediaRecorder(mediaStream)
        // MediaRecorder 생성
        setMediaRecorder(mediaRecorder);

        // 이벤트핸들러: 녹음 데이터 취득 처리
        mediaRecorder.ondataavailable = (event)=>{
          console.log(event.data)
            audioArray.push(event.data); // 오디오 데이터가 취득될 때마다 배열에 담아둔다.
        }

        // 녹음 시작
        mediaRecorder.start();
        setIsRecording(true);
      } else {
        // 녹음 종료
        mediaRecorder.stop();
        mediaRecorder.ondataavailable = (e) => {
          console.log(e.data);
        }
        // 이벤트핸들러: 녹음 종료 처리 & 재생하기
        mediaRecorder.onstop = (event)=>{
            
          // 녹음이 종료되면, 배열에 담긴 오디오 데이터(Blob)들을 합친다: 코덱도 설정해준다.
          const blob = new Blob(audioArray, {"type": "audio/ogg codecs=opus"});
          audioArray.splice(0); // 기존 오디오 데이터들은 모두 비워 초기화한다.
          
          // Blob 데이터에 접근할 수 있는 주소를 생성한다.
          const blobURL = window.URL.createObjectURL(blob);
          console.log(blobURL);
      }
        setIsRecording(false);
      }
    }

  return (
    <div className="w-full my-8 px-3">
      <form action="submit" onSubmit={onSubmitSelect}>
        {/* 디너 메뉴 */}
        <div className="my-3 flex justify-between relative">
          <h3 className="text-lg font-bold">디너 메뉴</h3>
          <select ref={menuRef} name="menu" onChange={onChangeMenuSelect} className="outline-none">
            <option value="">--디너 메뉴를 선택하세요--</option>
            <option value="valentine">Valentine dinner ($100)</option>
            <option value="french">French dinner ($130)</option>
            <option value="english">English dinner ($130)</option>
            <option value="champagne">Champagne Feast dinner ($250)</option>
          </select>
          <button className="absolute top-0 -right-40 p-2 shadow rounded-lg" onClick={onClickAudioBtn}>음성인식 시작/종료</button>
        </div>
        {/* 디너 스타일 */}
        <div className="my-3 flex justify-between">
          <h3 className="text-lg font-bold">디너 스타일</h3>
          <select ref={styleRef} name="style" onChange={onChangeStyleSelect} className="outline-none" disabled>
            <option value="">--디너 스타일을 선택하세요--</option>
            <option value="simple">Simple</option>
            <option value="grand">Grand (+ $20)</option>
            <option value="deluxe">Deluxe (+ $40)</option>
          </select>
        </div>
        { !isLogin && (
          <div className="my-8">
            <h3 className="text-xl font-bold text-center">비회원 주문을 위해 이름과 비밀번호를 입력해주세요</h3>
            <div className="mt-4 flex justify-end items-center">
              <input type="text" placeholder="이름" ref={nameRef} className="w-28 border-b-2 text-center outline-none" required/>
              <input type="password" placeholder="비밀번호" ref={passwordRef} className="ml-3 border-b-2 text-center outline-none" required/>
            </div>
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