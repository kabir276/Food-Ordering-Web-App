import { getOrder } from '@/APIcalls/orderCall';
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import logo from '../../../public/android-chrome-512x512.png'
import bike from '../../../public/bike.png'
export interface order {
	userId: number
	status: string
	totalAmount: number
	shippingAddress: string
	productName: string
}

const Order = () => {
	const router = useRouter();
	const { id: orderId } = router.query;
	const [orderdetails, setOrderDetails] = useState<order[] | null>(null);

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				if (orderId) {
					const order = await getOrder(parseInt(orderId as string));
					setOrderDetails(order);
					console.log(orderdetails)
				}
			} catch (error) {
				console.error("Error fetching order:", error);
			}
		};

		fetchOrder();
	}, [orderId]);
	
	return (
		<>
			<div className="container mx-auto h-screen  p-6 bg-[#a5956a] rounded-md shadow-md">
				<div className='flex 8'>
				<img src={logo.src} alt="Logo"  onClick={()=>{router.push("/")}} className='h-40 w-40  m-auto cursor-pointer' />
				</div>
				<h1 className="text-4xl font-bold flex justify-center text-center p-5 ">Food is being prepared</h1>

				{orderdetails && orderdetails.map((order) => (
					<div key={order.userId} className='mt-28'>
						<div className="mb-4 text-[#fff]">
							<p className="text-lg font-semibold">Status:  {order.status}</p>
						</div>
						<div className="mb-4 text-[#fff]">
							<p className="text-lg font-semibold ">Product Name:  {order.productName}</p>
						</div>
						<div className="mb-4 text-[#fff]">
							<p className="text-lg font-semibold ">Shipping Address:  {order.shippingAddress}</p>
						</div>
						<div className="mb-4 text-[#fff]">
							<p className="text-lg font-semibold ">Total Amount:  Rs.{order.totalAmount}</p>
						</div>
					</div>


				))}
			</div>
		</>
	);
};

export default Order;