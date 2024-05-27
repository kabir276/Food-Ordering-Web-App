import {atom} from "recoil";

interface userDetails {
  id:string
  order: []|null,
  addresses:[]|null,
  name:string,
  phonenumber:number,
  cart:[]|null
}
export const userDetailsState=atom<{isLoading: boolean, userData: null | userDetails}>({
  key: 'usersDetailsState',
  default: {
    isLoading: true,
    userData: null
  },
})