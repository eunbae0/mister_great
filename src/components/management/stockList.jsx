import { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase.config';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { v4 } from 'uuid';

function StockBox({ iid, name, quantity, setIsUpdateComplete }) {
  const onChangeStockQuantity = async (e, iid) => {
    // const ingredientDocRef = doc(db, "Stock", "Ingredient");
    // const quantity = e.target.value;
    // const arrayName = `ingredient[${iid}]`;
    // // To update age and favorite color:
    // await updateDoc(ingredientDocRef, {
    //     `${arrayName}`: {
    //       iid,
    //       name,
    //       quantity,
    //     }
    // });
    setIsUpdateComplete(prev => !prev);
  };
  
  const onClickDeleteBtn = async () => {
    await updateDoc(doc(db, 'Stock', 'Ingredient'), {
      ingredient: arrayRemove({
        name, 
        quantity,
        iid,
      })
    });
    setIsUpdateComplete(prev => !prev);
  };

  return (
    <li className="flex w-full justify-between my-3">
      <span className="w-1/3 text-center border-r-2">{name}</span>
      <div className="w-2/3 flex items-center justify-center relative">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={e => onChangeStockQuantity(e, iid)}
          className="text-center w-1/3 font-bold outline-none"
        />
        <button onClick={onClickDeleteBtn} className="absolute top-0 right-1">X</button>
      </div>
    </li>
  );
}

function StockList() {
  const [wineQuantity, setWineQuantity] = useState(0);
  const [ingredientArr, setIngredientArr] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isUpdateComplete, setIsUpdateComplete] = useState(false);

  const getOrderArr = async () => {
    setIsLoading(false);
    const stockWineDocSnap = await getDoc(doc(db, 'Stock', 'Wine'));
    setWineQuantity(stockWineDocSnap.data().wine);
    const stockIngredientDocSnap = await getDoc(doc(db, 'Stock', 'Ingredient'));
    setIngredientArr(stockIngredientDocSnap.data().ingredient);
    setIsLoading(true);
  };

  useEffect(() => {
    getOrderArr();
  }, [isUpdateComplete]);

  const onChangeWineQuantity = async (e) => {
    const wineDocRef = doc(db, "Stock", "Wine");
    const quantity = e.target.value;
    await updateDoc(wineDocRef, {
        wine: quantity
    });
    setIsUpdateComplete(prev => !prev);
  }

  const ingredientNameRef = useRef(null);
  const ingredientQuantityRef = useRef(null);
  const onSubmitAddStock = async (e) => {
    e.preventDefault();
    const name = ingredientNameRef.current.value;
    const quantity = ingredientQuantityRef.current.value;
    const iid = v4();
    await updateDoc(doc(db, 'Stock', 'Ingredient'), {
      ingredient: arrayUnion({
        name, 
        quantity,
        iid,
      })
    });
    setIsUpdateComplete(prev => !prev);
    name = '';
    quantity = '';
  };

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
          <div className="w-2/3 flex items-center justify-center">
            { isLoading && <input
              type="number"
              min="1"
              value={wineQuantity}
              onChange={onChangeWineQuantity}
              className="text-center w-1/3 font-bold outline-none"
            />}
          </div>
        </div>
      </div>
      <div className="my-8 w-1/2">
        <h1 className="text-xl font-bold text-center p-4 border-b-2">재료</h1>
        <div className="flex w-full justify-between my-3">
          <span className="w-1/3 text-center font-bold border-r-2">품명</span>
          <span className="w-2/3 text-center font-bold">수량</span>
        </div>
        <ul>
          {ingredientArr.map(ing => <StockBox key={ing.iid} iid={ing.iid} name={ing.name} quantity={ing.quantity} setIsUpdateComplete={setIsUpdateComplete} />)}
        </ul>
        <form action="submit" onSubmit={onSubmitAddStock} className="flex w-full justify-between my-3 relative border-t-2 pt-2">
          <input type="text" placeholder="품명" ref={ingredientNameRef} className="w-1/3 text-center outline-none border-r-2"></input>
          <div className="w-2/3 flex items-center justify-center relative">
            <input
              type="number"
              placeholder="수량"
              min="1"
              ref={ingredientQuantityRef}
              className="text-center w-1/3 font-bold outline-none"
            />
            <button type="submit" className="absolute top-0 right-1">+</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StockList;