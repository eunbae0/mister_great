import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { signOut } from 'firebase/auth';

import { auth, db } from '../../firebase.config';
import StockList from '../../components/management/stockList';
import BrowseOrderList from '../../components/management/browseOrderList';

function Management() {
  const [managementState, setManagementState] = useState('stocklist');

  const navigate = useNavigate();

  const onClickLogout = async () => {
    await signOut(auth);
    navigate('/');
    location.reload();
  };

  return (
    <div className="relative">
      <button className="absolute top-0 right-0" onClick={onClickLogout}>
        Logout
      </button>
      <div className="flex w-full h-20 items-center justify-center">
        <button to="./stocklist" className="h-full w-1/2 mt-1 text-xl font-bold border-r-2" onClick={() => setManagementState('stocklist')}>재고관리</button>
        <button to="./orderlist" className="h-full w-1/2 mt-1 text-xl font-bold" onClick={() => setManagementState('orderlist')}>주문내역관리</button>
      </div>
      { managementState === 'stocklist' ? <StockList /> : <BrowseOrderList /> }
    </div>
  )
}

export default Management;