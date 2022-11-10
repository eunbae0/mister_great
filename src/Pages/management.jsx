import { useState } from 'react';

import StockList from '../components/management/stockList';
import BrowseOrderList from '../components/management/browseOrderList';

function Management() {
  const [managementState, setManagementState] = useState('stocklist');
  return (
    <div className="">
      <div className="flex w-full h-20 items-center justify-center border-b-2">
        <button to="./stocklist" className="w-1/2" onClick={() => setManagementState('stocklist')}>재고관리</button>
        <button to="./orderlist" className="w-1/2" onClick={() => setManagementState('orderlist')}>주문내역관리</button>
      </div>
      { managementState === 'stocklist' ? <StockList /> : <BrowseOrderList /> }
    </div>
  )
}

export default Management;