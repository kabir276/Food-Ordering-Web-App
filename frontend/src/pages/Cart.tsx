import { addItem, updateCart, getCart, deleteCart } from "@/APIcalls/cartCalls";
import { useCallback, useEffect, useState, memo } from "react";
import { useRouter } from "next/router";
import AddressManager from "../components/addresses";
import { placeOrder } from "@/APIcalls/orderCall";
import Navigation from "@/components/navigation";
import React from "react";

export interface Menu {
  id: number;
  item: string;
  description: string;
  imageLink: string;
  category: string;
  price: number;
}

export interface Cart {
  id: number;
  userId: number;
  menuItemId: number;
  quantity: number;
  menuItem: Menu;
}

function Cart() {
  const [active, setActive] = useState(1);
  const [cart, setCart] = useState<Cart[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [addressidcart, setAddressidcart] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await getCart();
        setCart(cartData);
        calculateTotalAmount(cartData);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const placeordercta = useCallback(
    async (addressidcart: number) => {
      if (!addressidcart) {
        setError("Please select an address to place the order.");
        return;
      }

      try {
        const res = await placeOrder(addressidcart);
        if (res.orderId) {
          router.push(`/order/${res.orderId}`);
        } else {
          setError(res.error || "Error placing order. Please try again later.");
        }
      } catch (err) {
        setError("Error placing order. Please try again later.");
      }
    },
    [router]
  );

  const calculateTotalAmount = useCallback((cart: Cart[]) => {
    const total = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
    setTotalAmount(total);
  }, []);

  const updateTotalAmount = useCallback(
    (cartId: number, newQuantity: number) => {
      setCart((currentCart) => {
        const updatedCart = currentCart
          .map((item) => {
            if (item.id === cartId) {
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
          .filter((item) => item.quantity > 0); // Filter out items with 0 quantity

        calculateTotalAmount(updatedCart);
        return updatedCart;
      });
    },
    [calculateTotalAmount]
  );

  return (
    <>
      <Navigation active={active} setActive={setActive} />
      <div className={"w-screen"} style={{ background: "#121212" }}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className={"flex mb-4 p-5"}>
            {cart.length === 0 || totalAmount === 0 ? (
              <>
                <img src="/mealimg.png" alt="Logo" />
                <p className="text-7xl text-white text-center m-auto">
                  Cart is empty!{" "}
                  <a
                    href=""
                    onClick={() => {
                      router.push("/Menu");
                    }}
                  >
                    Add Items to Cart
                  </a>
                </p>
              </>
            ) : (
              <div className="flex md:flex-row-reverse flex-col md:justify-between justify-between gap-20 m-auto w-full ">
                <div className="pt-24 md:pt-0 ">
                  <div className="flex flex-wrap justify-center flex-col m-auto h-[100%] -mt-20">
                    {cart.map((cartItem) => (
                      <CartItems
                        key={cartItem.menuItemId}
                        menu={cartItem.menuItem}
                        onQuantityChange={updateTotalAmount}
                      />
                    ))}
                  </div>
                  <p className="text-[#f2ffa6] mt-24 text-xl text-center">
                    total amount: Rs.{totalAmount.toFixed(2)}
                  </p>
                  <hr className={"border-b-2 border-[#ffffff90] w-[auto]"} />
                  <button className="hidden md:block" onClick={() => placeordercta(addressidcart)}>
                    place order
                  </button>
                </div>
                <div className="p-5 text-[#fff] text-xl  ">
                  <AddressManager setAddressidcart={setAddressidcart} />
                </div>
                <button className="md:hidden " onClick={() => placeordercta(addressidcart)}>
                  place order
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export const CartItems = memo(
  ({ menu, onQuantityChange }: { menu: Menu; onQuantityChange: (cartId: number, newQuantity: number) => void }) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [cartId, setCartId] = useState<number | null>(null);

    useEffect(() => {
      let isMounted = true;
      const fetchCartItem = async () => {
        try {
          const cartItems = await getCart();
          const cartItem = cartItems.find((item: Cart) => item.menuItemId === menu.id);
          if (cartItem && isMounted) {
            setCartId(cartItem.id);
            setQuantity(cartItem.quantity);
          }
        } catch (err) {
          console.error("Error fetching cart item:", err);
        }
      };
      fetchCartItem();
      return () => {
        isMounted = false;
      };
    }, [menu.id]);

    const handleQuantityChange = useCallback(
      async (newQuantity: number) => {
        if (!cartId) {
          console.error("Cart ID not found. Unable to update quantity.");
          return;
        }
        try {
          if (newQuantity > 0) {
            await updateCart(cartId, newQuantity);
            setQuantity(newQuantity);
            onQuantityChange(cartId, newQuantity);
          } else {
            await deleteCart(cartId);
            onQuantityChange(cartId, newQuantity);
            setQuantity(1);
          }
        } catch (err) {
          console.error("Error updating cart item:", err);
        }
      },
      [cartId, onQuantityChange]
    );

    const decrease = useCallback(() => handleQuantityChange(Math.max(0, quantity - 1)), [handleQuantityChange, quantity]);

    const increase = useCallback(() => handleQuantityChange(quantity + 1), [handleQuantityChange, quantity]);

    const totalPrice = quantity * menu.price;

    return (
      <div className="p-4 sm:m-4 flex flex-row justify-between w-[25rem]">
        <div className="text-left ">
          <h4 className="text-lg font-semibold mb-2 text-white">{menu.item}</h4>
        </div>
        <div>
          <div>
            <div className="flex items-center flex-row w-auto -mt-2">
              <button className="w-full pl-2 pr-2 h-[auto] text-center text-sm m-auto text-[#000000f6]" onClick={decrease}>
                -
              </button>
              <span className="text-[gray] text-xl p-2 m-auto">{quantity}</span>
              <button className="w-full pl-2 pr-2 h-[auto] text-center text-sm m-auto text-[#000000f6]" onClick={increase}>
                +
              </button>
              <p className="text-xs font-bold mb-2 text-[#ffeea5] ml-2 mt-2">Rs.{totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default Cart;
