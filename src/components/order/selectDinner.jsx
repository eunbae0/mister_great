import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [audioUrl, setAudioUrl] = useState();
  const onClickAudioBtn = async (event) => {
    if(!isRecording){
      setAudioUrl(null);
      // 마이크 mediaStream 생성: Promise를 반환하므로 async/await 사용
      const mediaStream = await navigator.mediaDevices.getUserMedia({audio: true});
      const mediaRecorder = new MediaRecorder(mediaStream)
      // MediaRecorder 생성
      setMediaRecorder(mediaRecorder);
      // 녹음 시작
      mediaRecorder.start();
      setIsRecording(true);
    } else {
      // 녹음 종료
      mediaRecorder.stop();
      mediaRecorder.ondataavailable = (e) => {
        console.log(e.data);
        setAudioUrl(e.data);
      }
      setIsRecording(false);
    }
  }
  const onClickSubmitBtn = useCallback(() => {
    if (audioUrl) {
      console.log(URL.createObjectURL(audioUrl)); // 출력된 링크에서 녹음된 오디오 확인 가능
    } else {alert('먼저 음성인식을 시작해 주세요')}
    // File 생성자를 사용해 파일로 변환
    const sound = new File([audioUrl], "soundBlob", { lastModified: new Date().getTime(), type: "audio" });
    console.log(sound); // File 정보 출력
  }, [audioUrl]);
  return (
    <div className="w-full my-8 px-3 relative">
      <div className="absolute -top-36 -translate-x-[105%] left-0 flex flex-col items-center">
        <h3 className="font-bold text-2xl mb-4">메뉴 가이드</h3>
        <div className="text-center">
          <div className="font-bold mb-1">Valentine dinner  $100</div>
          <div>작은 하트 모양과 큐피드가 장식된</div>
          <div>접시, 냅킨, 와인, 스테이크가 제공됩니다</div>
        </div>
        <div className="text-center">
          <div className="font-bold mt-4 mb-1">French dinner  $130</div>
          <div>커피 한잔, 와인 한잔, 샐러드, 스테이크가 제공됩니다</div>
        </div>
        <div className="text-center">
          <div className="font-bold mt-4 mb-1">English dinner  $130</div>
          <div>에그 스크램블, 베이컨, 빵, 스테이크가 제공됩니다</div>
        </div>
        <div className="text-center">
          <div className="font-bold mt-4 mb-1">Champagne Feast dinner  $250</div>
          <div>기본 2인 식사</div>
          <div>샴페인 한병, 4개의 바게트빵</div>
          <div>커피 한 포트, 와인, 스테이크가 제공됩니다</div>
        </div>
        <h3 className="font-bold text-2xl mt-7 mb-4">스타일 가이드</h3>
        <div className="text-center">
          <div className="font-bold mb-1">Simple dinner  +$0</div>
          <div>상자 접시에 냅킨이 플라스틱 쟁반에 제공됩니다</div>
        </div>
        <div className="text-center">
          <div className="font-bold mt-4 mb-1">Grand dinner  +$20</div>
          <div>도자기 접시와 컵, 흰색 면 냅킨이 나무 쟁반에 제공됩니다</div>
        </div>
        <div className="text-center">
          <div className="font-bold mt-4 mb-1">Deluxe dinner  +$40</div>
          <div>은 쟁반에 꽃들이 있는 작은 꽃병,</div> 
          <div>도자기 접시와 린넨 냅킨이 제공됩니다</div>
        </div>
      </div>
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
          {/* <button className="absolute top-16 -right-20" onClick={onClickSubmitBtn}>제출</button> */}
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