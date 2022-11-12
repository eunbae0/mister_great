function StockList() {
  return (
    <div className="w-full flex flex-col items-center mt-10">
      <div className="my-8 w-1/2">
        <h1 className="text-xl font-bold text-center p-4 border-b-2">술</h1>
        <div className="flex w-full justify-between my-3">
          <span className="w-1/3 text-center font-bold border-r-2">품명</span>
          <span className="w-2/3 text-center font-bold">수량</span>
        </div>
        <div className="flex w-full justify-between my-3">
          <span className="w-1/3 text-center border-r-2">와인</span>
          <span className="w-2/3 text-center">2</span>
        </div>
      </div>
      <div className="my-8 w-1/2">
        <h1 className="text-xl font-bold text-center p-4 border-b-2">재료</h1>
        <div className="flex w-full justify-between my-3">
          <span className="w-1/3 text-center font-bold border-r-2">품명</span>
          <span className="w-2/3 text-center font-bold">수량</span>
        </div>
        <ul>
          <li className="flex w-full justify-between my-3">
            <span className="w-1/3 text-center border-r-2">커피</span>
            <span className="w-2/3 text-center">2</span>
          </li>
          <li className="flex w-full justify-between my-3">
            <span className="w-1/3 text-center border-r-2">계란</span>
            <span className="w-2/3 text-center">2</span>
          </li>
          <li className="flex w-full justify-between my-3">
            <span className="w-1/3 text-center border-r-2">베이컨</span>
            <span className="w-2/3 text-center">2</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default StockList;