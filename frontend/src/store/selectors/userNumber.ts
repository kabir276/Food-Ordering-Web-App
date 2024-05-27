
import { userState } from "../atoms/user";
import {selector} from "recoil";

export const usernumberState = selector({
  key: 'usernumberState',
  get: ({get}) => {
    const state = get(userState);

    return state.userNumber;
  },
});
