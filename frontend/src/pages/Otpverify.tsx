import { signin, signup, verifyOtp } from '@/APIcalls/usercalls';
import { userState } from '@/store/atoms/user';
import { useremailState } from '@/store/selectors/userNumber';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import 'react-toastify/dist/ReactToastify.css';
const Otpverify = () => {
    const router= useRouter()
	const userEmail=useRecoilValue(useremailState)
	const [otp, setotp] = useState<number>();

	const verifyotp = async (e: any) => {
		e.preventDefault();
		const email = userEmail;
		try {
			await verifyOtp(String(email), Number(otp));
			
			router.push("/");
		} catch (error:any) {
			// Handle the error, e.g., show an error toast
			toast.error("Failed to verify OTP. Please try again.");
		}
	};
	return (
		<>
			<div
				style={{
					margin: '0',
					padding: '0',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '100vh',
					background:"black",
					fontFamily: 'sans-serif',
				}}
			>
				<div className='main'>
							<div className="otp" style={{background:"#000000"}}>
						<form  onSubmit={(e)=>{verifyotp(e)}}>
							<label	htmlFor="chk"	aria-hidden="true">
								OTP Verification
							</label>
							<input
								onChange={(e) => {
									setotp(Number(e.target.value));
								}}
								type="number"
								name="Otp"
								placeholder="6 DigitOTP"
								required={true}
							/>

							<button type='submit' style={{background:"#f7db3d",color:"black" }}>verify OTP</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Otpverify;