import { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { reorder } from '../../store';

import { db } from '../../firebase.config';
import { updateDoc, doc } from 'firebase/firestore';

function SubmitInfo({ setProgress, orderId }) {
  // useState
  const infoObject = { 
    time: '',
    place: '',
  };
  const [obj, setObj] = useState(infoObject);
  
  const onChangeSubmitInfo = (e) => {
    const name = e.target.name; // input에서 지정해준 name정보
    if (name === 'time') {
      setObj((prev) => {
        return { ...prev, time: e.target.value};
      });
    }
    else if (name === 'place') {
      setObj((prev) => {
        return { ...prev, place: e.target.value};
      });
    } else {
      console.log('error');
    }
  };

  const onSubmitSubmitInfo = async (e) => {
    e.preventDefault();
    if(obj.place == '' || obj.time == '') {
      alert('정보를 모두 입력하세요');
      return;
    }
    const today = new Date();   
    const year = today.getFullYear(); // 년도
    const month = today.getMonth() + 1;  // 월
    const date = today.getDate();  // 날짜

    const fullTime = year + '/' + month + '/' + date + '/' + obj.time;
    await updateDoc(doc(db, "Order", orderId), {
      time: fullTime,
      place: obj.place,
      status: "조리중",
    });
    setProgress(2);
    // 이 함수는 작성안하셔도 됩니다!
  };

  const placeRef = useRef(null);
  const reorderObj = useRecoilValue(reorder);
  useEffect(() => {
    const place = placeRef.current;
    if (reorderObj.isReorder) {
      place.value = reorderObj.place;
      setObj((prev) => {
        return { ...prev, place: reorderObj.place};
      });
    }
  }, [])

  return (
    <div>      
      <form onSubmit={onSubmitSubmitInfo}>
        <input
          onChange={onChangeSubmitInfo}
          name="time"
          type="time"
          placeholder="시간"
          />
        <input
          ref={placeRef}
          onChange={onChangeSubmitInfo}
          name="place"
          type="text"
          placeholder="장소"
        />
        <button type="submit">
          다음 단계
        </button>
      </form>
    </div>
  )
}

export default SubmitInfo;