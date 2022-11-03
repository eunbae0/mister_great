import { atom } from "recoil"

export const user = atom({
  key: "reOrder",
  default: {
    menu: "",
    style: "",
    place: "",
  },
});
