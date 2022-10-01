function OrderHistory({ isLogin }) {
  return (
    <div>
      {isLogin ? "목록표시" : "주소+이름 받고 목록표시"}
    </div>
  )
}

export default OrderHistory;