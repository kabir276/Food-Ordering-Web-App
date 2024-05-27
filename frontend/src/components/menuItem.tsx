import { addItem, getCart, updateCart, deleteCart } from "@/APIcalls/cartCalls";
import { useState, useEffect, useCallback } from "react";

export interface Menu {
  id: number;
  item: string;
  description: string;
  imageLink: string;
  category: string;
  price: number;
}

function MenuItem({ menu }: { menu: Menu }) {
  const [quantity, setQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [cartId, setCartId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const fetchCart = useCallback(async () => {
    try {
      const cartItems = await getCart();
      const cartItem = cartItems.find((item: { menuItemId: number }) => item.menuItemId === menu.id);
      if (cartItem) {
        setCartId(cartItem.id);
        setQuantity(cartItem.quantity);
        setShowQuantitySelector(true);
      }
    } catch (error) {
      console.log(error)
    }
  }, [menu.id]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const decrease = useCallback(
    async () => {
      if (cartId) {
        const currentQuantity = Math.max(quantity - 1, 0);
      
          if (currentQuantity === 0) {
            setShowQuantitySelector(false);
            await deleteCart(cartId);
          } else {
            const res=await updateCart(cartId, currentQuantity);
            if(res){
              setQuantity(currentQuantity);
              setError("")
            }else{
              setError(`${res.error}`)
            }
          }
        
      }
    },
    [cartId, quantity]
  );

  const increase = useCallback(
    async () => {
      if (cartId) {
        const currentQuantity = quantity + 1;
       
         const res= await updateCart(cartId, currentQuantity);
       
        if(res){
          setQuantity(currentQuantity);
        
        } 
      }
    },
    [cartId, quantity]
  );

  const handleAddToCart = useCallback(
    async (menuID: number) => {
     
        const res=await addItem(menuID, quantity);
        
    
          setShowQuantitySelector(true);
          setError("")
        
       
    },
    [quantity]
  );

  return (
    <div className=" sm:m-4 flex flex-row justify-between sm:w-[50rem] w-[80%] p-5 m-5 border-[#ffffff3d] border">
      <div className="text-left">
        <h3 className="text-lg font-semibold mb-2 text-white">{menu.item}</h3>
        <p className="text-base font-bold mb-2 text-[#ffeea5]">Rs.{menu.price.toFixed(2)}</p>
        <p className="text-sm text-gray-400 mb-2">{menu.description}</p>
      </div>
      <div>
        <img src={menu.imageLink} alt={menu.imageLink} className="w-full sm:h-auto sm:mb-4" />
        <div>
          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
          {showQuantitySelector ? (
            <div className="flex items-center w-auto">
              <button className="w-full px-2 mx-2 h-[2rem] text-xl text-[#fff6e7f6]" onClick={decrease}>
                -
              </button>
              <span className="text-[#c9c7c7] mt-1 font-bold text-2xl">{quantity}</span>
              <button className="w-full pl-2 ml-2 pr-2 h-[2rem] text-xl text-[#fff6e7f6]" onClick={increase}>
                +
              </button>
            </div>
          ) : (
            <button onClick={() => handleAddToCart(menu.id)} className="w-auto pl-2 pr-2 h-[2rem] text-xl text-[#fff6e7f6] align-middle">
              add +
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuItem;