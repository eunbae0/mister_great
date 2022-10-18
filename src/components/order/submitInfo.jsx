import { useState } from 'react';
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
        return { ...prev, text: e.target.value};
      });
    } else {
      console.log('error');
    }
  };

  const onSubmitSubmitInfo = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "Order", orderId), {
      time: obj.time,
      place: obj.place,
    });
    setProgress(2);
    // 이 함수는 작성안하셔도 됩니다!
  };

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