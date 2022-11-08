import { atom } from "recoil"

export const reorder = atom({
  key: "reorder",
  default: {
    isReorder: false,
    menu: "",
    style: "",
    place: "",
  },
});

export const authInfo = atom({
  key: "authInfo",
  default: {
    isAuthLoading: true,
    isLogin: false,
    uid: '',
  }
})

export const nonMemberInfo = atom({
  key: "nonMemberInfo",
  default: {
    isNonMemberLogin: false,
    nonMemberInfo: {
      name: '',
      password: '',
    }
  }
})

export const orderInfoState = atom({
  key: "orderInfo",
  default: {
    finalAmount: 0,
    orderList: [{
      menu: '',
      style: '',
      amount: 0,
      orderListId: 0,
      quantity: 0,
    }]
  }
})