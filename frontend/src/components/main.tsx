import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from '@/components/navigation';

// import Menu from '../pages/Menu';
// import AboutUs from './aboutUs'
// import Blogs from './blogs'
// import Cart from './cart';

const Main = () => {
  const [active, setActive] = useState(1)
 
  const router =useRouter()
  // const displayData = () => {
  //   switch (active) {
  //     case 1:
  //       return  <Home/>;
  //     case 2:
  //       return <Menu />;
  //     case 3:
  //       return <AboutUs />;
  //     case 4:
  //       return <Blogs />;
  //     case 5:
  //         return <Cart/>
  

  //     default:
  //       return <Home />;
  //   }
  // };
  return (
    <div className=''style={{}} >
     <div style={{background:'#121212'}}>
      <Navigation active={active} setActive={setActive} />
    </div >
    <div style={{ display:"flex", flexDirection:"column",height:"auto", background:"#121212"}}>
         
          </div>
    </div>
  )

}

export default Main;