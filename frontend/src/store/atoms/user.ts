import {atom} from "recoil";

export const userState = atom<{
    [x: string]: any;isLoading: boolean, userEmail: null | string
}>({
  key: 'usersState',
  default: {
    isLoading: true,
    userEmail: null
  },
});
