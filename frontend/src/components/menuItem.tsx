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
      

        if (quantity === 1) {
          setShowQuantitySelector(false);
          await deleteCart(cartId);
        } else {
          const currentQuantity = Math.max(quantity - 1, 0);
          const res = await updateCart(cartId, currentQuantity);
          if (res) {
            setQuantity(currentQuantity);
            setError("")
          } else {
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

        const res = await updateCart(cartId, currentQuantity);

        if (res) {
          setQuantity(currentQuantity);

        }
      }
    },
    [cartId, quantity]
  );

  const handleAddToCart = useCallback(
    async (menuID: number) => {

    const res = await addItem(menuID, quantity);


    setShowQuantitySelector(true);
    setError("")


    },
    [quantity]
  );

  return (
    <div className=" sm:m-4 flex flex-row gap-2 md:gap-8 justify-between sm:w-[50rem] md:w-[80%] p-5 m-5 border-[#ffffff3d] border">
      <div className="text-left  md:w-[90%]">
        <h3 className="text-lg font-semibold mb-2 text-white">{menu.item}</h3>
        <p className="text-base font-bold mb-2 text-[#ffeea5]">Rs.{menu.price.toFixed(2)}</p>
        <p className="text-sm text-gray-400 mb-2">{menu.description}</p>
      </div>
      <div className="m-auto">
      <img src={menu.imageLink} alt={menu.imageLink} className="object-cover md:ml-[40%] md:h-[40%] md:w-[40%]  my-auto rounded-xl " />

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {showQuantitySelector ? (
          <div className="flex justify-center  items-center m-auto px-2 md:w-36 md:ml-[42%]">
            <button className="md:w-8 w-[1.5rem]  md:pb-1 h-[1.5rem]  md:h-[2rem] font-bold text-xl text-[#000000f6]" onClick={decrease}>
              -
            </button>
            <span className="text-[#c9c7c7] w-6 mt-2 ml-5 mx-4 font-bold text-2xl">{quantity}</span>
            <button className="md:w-8 w-[1.5rem]    md:pb-1 h-[1.5rem]   md:h-[2rem] font-bold text-xl text-[#000000f6]" onClick={increase}>
              +
            </button>
          </div>
        ) : (
          <button onClick={() => handleAddToCart(menu.id)} className="w-auto md:w-32 pl-2 pr-2 h-[2.5rem] m-auto md:ml-[44%] mt-4 text-xl text-[#fff6e7f6] align-middle">
            add +
          </button>
        )}
      </div>
    </div>


  );
}

export default MenuItem;