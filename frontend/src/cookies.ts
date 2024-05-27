// In authService.js
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const getToken = () => {
  const token = cookies.get('token');
  // console.log("getToken - Token:", token); 
  return token;
};

// In authService.js
export const setToken = (token:any) => {
  cookies.set('token', token, { path: '/', domain: 'localhost' });
  // console.log('setToken - Token set:', token);
};


export const removeToken = () => {
  const token = cookies.get('token');
  // console.log("removeToken - Token removed:", token); 
  cookies.remove('token', { path: '/' });
};
