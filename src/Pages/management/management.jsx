import { useState } from 'react';

import StockList from '../components/management/stockList';
import BrowseOrderList from '../components/management/browseOrderList';

function Management() {
  const [managementState, setManagementState] = useState('stocklist');
  return (
    <div className="">
      <div className="flex w-full h-20 items-center justify-center">
        <button to="./stocklist" className="h-full w-1/2 mt-1 text-xl font-bold border-r-2" onClick={() => setManagementState('stocklist')}>재고관리</button>
        <button to="./orderlist" className="h-full w-1/2 mt-1 text-xl font-bold" onClick={() => setManagementState('orderlist')}>주문내역관리</button>
      </div>
      { managementState === 'stocklist' ? <StockList /> : <BrowseOrderList /> }
    </div>
  )
}

export default Management;