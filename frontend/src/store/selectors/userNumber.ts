
import { userState } from "../atoms/user";
import {selector} from "recoil";

export const useremailState = selector({
  key: 'useremailState',
  get: ({get}) => {
    const state = get(userState);

    return state.userEmail;
  },
});
