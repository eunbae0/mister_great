import { useState } from 'react';

function SelectDinner({ setProgress }) {
  const object = {dinnerStyle: '', dinnerType: '',};
  const [obj, setObj] = useState(object);

  const onChangeSelect = (e) => {
    // ../Pages/register.jsx 파일 참고해서 작성해주세요
    const type = e.target.type;
    if (type === 'menu') {
      setAuthObj((prev) => {
        return { ...prev, email: e.target.value};
      });
    }
    else if (type === 'style') {
      setAuthObj((prev) => {
        return { ...prev, password: e.target.value};
      });
    } else {
      console.log('error');
    }
  };

  const onSubmitSelect = (e) => {
    e.preventDefault();
    setProgress(1);
    // 이 함수는 작성안하셔도 됩니다!
  }

  return (
    <div>
      <form action="submit" onSubmit={onSubmitSelect}>
        {/* 디너 메뉴 */}
        <select type = "menu" onChange={onChangeSelect}>
          <option value="">--Please choose an option--</option>
          <option value="valentine">Valentine dinner</option>
          <option value="french">French dinner</option>
          <option value="english">English dinner</option>
          <option value="champagne">Champagne Feast dinner</option>
        </select>
        {/* 디너 스타일 */}
        <select type="style" onChange={onChangeSelect}>
          <option value="">--Please choose an option--</option>
          <option value="simple">Simple</option>
          <option value="grand">Grand</option>
          <option value="deluex">Deluex</option>
        </select>
        <button type="submit">
          다음 단계
        </button>
      </form>
    </div>
  )
}

export default SelectDinner;