
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const getToken = () => {
  const token = cookies.get('token');
 
  return token;
};


export const setToken = (token:any) => {
  cookies.set('token', token, { path: '/', domain: 'rollup-nutrition.vercel.app' });
 
};


export const removeToken = () => {
  const token = cookies.get('token');
  
  cookies.remove('token', { path: 'rollup-nutrition.vercel.app' });
};
