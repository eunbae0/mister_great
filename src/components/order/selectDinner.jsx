import { useState } from 'react';

function SelectDinner({ setProgress }) {
  const object = {dinnerStyle: '', dinnerType: '',};
  const [obj, setObj] = useState(object);

  const onChangeSelect = () => {
    // ../Pages/register.jsx 파일 참고해서 작성해주세요
  };

  const onSubmitSelect = (e) => {
    e.preventDefault();
    setProgress(1);
    // 이 함수는 작성안하셔도 됩니다!
  }

  return (
    <div>
      <form action="submit" onSubmit={onSubmitSelect}>
        {/* 디너 스타일 */}
        <select onChange={onChangeSelect}>
          <option value="">--Please choose an option--</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="hamster">Hamster</option>
        </select>
        {/* 디너 종류 */}
        <select onChange={onChangeSelect}>
          <option value="">--Please choose an option--</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="hamster">Hamster</option>
        </select>
        <button type="submit">
          다음 단계
        </button>
      </form>
    </div>
  )
}

export default SelectDinner;