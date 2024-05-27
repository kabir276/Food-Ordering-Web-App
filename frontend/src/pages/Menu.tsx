import { addItem, getCart, deleteCart } from "@/APIcalls/cartCalls";
import { getMenu } from "@/APIcalls/menuCalls";
import MenuItem from "@/components/menuItem";
import Navigation from "@/components/navigation";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";

export interface Menu {
  id: number;
  item: string;
  description: string;
  imageLink: string;
  category: string;
  price: number;
}

function Menu() {
  const [active, setActive] = useState(1);
  const [menu, setMenu] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const router = useRouter();
 

  const getMenuCall = useCallback(async () => {
    
    try {
      const menuItems = await getMenu();
      setMenu(menuItems);
      setIsLoading(false);
    } catch (err) {
     
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getMenuCall();
  }, [getMenuCall]);

  const uniqueCategories = Array.from(new Set(menu.map((item) => item.category)));

  if (isLoading) {
    return <p>Loading...</p>;
  }


  return (
    <>
      <div className="">
        <Navigation active={active} setActive={setActive} />
      </div>
      <div className={"flex flex-col m-auto justify-center w-screen"} style={{ background: "#121212" }}>
        {uniqueCategories.map((category) => (
          <div key={category} className="flex flex-col mb-4 m-auto justify-center ">
            <div>
              <h2 className="text-3xl font-bold mb-2 ml-4 text-[#fff652] ">{category}</h2>
            </div>
            <div className="flex flex-wrap justify-center">
              {menu
                .filter((item) => item.category === category)
                .map((menuItem) => (
                  <MenuItem key={menuItem.id} menu={menuItem} />
                ))}
            </div>
            <div>
              <hr className={"border-b-2 border-[#ffffff90] m-auto w-screen"} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Menu;