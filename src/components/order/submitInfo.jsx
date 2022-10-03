import { useState } from 'react';

function SubmitInfo({ setProgress }) {
  // useState
  
  const onChangeSubmitInfo = () => {

  };

  const onSubmitSubmitInfo = (e) => {
    e.preventDefault();
    setProgress(2);
    // 이 함수는 작성안하셔도 됩니다!
  };

  return (
    <div>      
      <form onSubmit={onSubmitSubmitInfo}>
        <input
          onChange={onChangeSubmitInfo}
          type="time"
          placeholder="시간"
          />
        <input
          onChange={onChangeSubmitInfo}
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