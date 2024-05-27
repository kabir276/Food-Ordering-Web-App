import {atom} from "recoil";

export const userState = atom<{
    [x: string]: any;isLoading: boolean, userNumber: null | number
}>({
  key: 'usersState',
  default: {
    isLoading: true,
    userNumber: null
  },
});
