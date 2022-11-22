import { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { reorderState } from '../../store/index';

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
  const reorder = useRecoilValue(reorderState);
  useEffect(() => {
    const place = placeRef.current;
    if (reorder.isReorder) {
      place.value = reorder.place;
      setObj((prev) => {
        return { ...prev, place: reorder.place};
      });
    }
  }, [])

  return (
    <div className="w-full my-8 px-3">
      <form onSubmit={onSubmitSubmitInfo}>
        <div className="my-3 flex justify-between">
          <h3 className="text-lg font-bold">배달 시간</h3>
          <input
            onChange={onChangeSubmitInfo}
            name="time"
            type="time"
            placeholder="시간"
            />
        </div>
        <div className="my-3 flex justify-between">
          <h3 className="text-lg font-bold">배달 장소</h3>
          <input
            ref={placeRef}
            onChange={onChangeSubmitInfo}
            name="place"
            type="text"
            placeholder="장소"
            className="outline-none"
          />
        </div>
        <div className="mt-8 text-right">
          <button type="submit" className="font-bold p-3 px-5 rounded-full shadow-lg border">
            다음 단계
          </button>
        </div>
      </form>
    </div>
  )
}

export default SubmitInfo;