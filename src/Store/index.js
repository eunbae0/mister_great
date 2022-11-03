import { atom } from "recoil"

export const user = atom({
  key: "selectedLastOrder",
  default: {
    menu: "",
    style: "",
    place: "",
  },
});
