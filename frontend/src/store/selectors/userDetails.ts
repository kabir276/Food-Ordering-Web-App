import { selector } from "recoil";
import { userDetailsState } from "../atoms/userDetails";



export const userloadingState = selector({
    key: 'userloadingState',
    get: ({ get }) => {
        const state = get(userDetailsState);
        return state.isLoading;
    },
});
export const userIdState = selector({
    key: 'userIdState',
    get: ({ get }) => {
        const state = get(userDetailsState);
        if (state.userData) {
            return state.userData.id;
        }
        return "";
    },
});
export const usernameState = selector({
    key: 'usernameState',
    get: ({ get }) => {
        const state = get(userDetailsState);
        if (state.userData) {
            return state.userData.name;
        }
        return "";
    },
});
export const useremailState = selector({
    key: 'useremailState',
    get: ({ get }) => {
        const state = get(userDetailsState);
        if (state.userData) {
            return state.userData.email;
        }
        return "";
    },
});
export const usercartState = selector({
    key: 'usercartState',
    get: ({ get }) => {
        const state = get(userDetailsState);
        if (state.userData) {
            return state.userData.cart;
        }
        return "";
    },
});
export const useraddressState = selector({
    key: 'useraddressState',
    get: ({get}) => {
      const state = get(userDetailsState);
      if (state.userData) {
          return state.userData.addresses;
      }
      return "";
    },
    });

export const userorderState = selector({
        key: 'userorderState',
        get: ({get}) => {
          const state = get(userDetailsState);
          if (state.userData) {
              return state.userData.order;
          }
          return "";
        },
        });