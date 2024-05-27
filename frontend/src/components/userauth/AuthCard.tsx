import { signin, signup } from '@/APIcalls/usercalls';
import { userState } from '@/store/atoms/user';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
const AuthCard = () => {
	const router = useRouter()
	const setUser = useSetRecoilState(userState);
	const [phoneNumber, setPhoneNumber] = useState<number>(0);
	const [username, setusername] = useState<string>("");
	
	const handleLogin =  (e: any) => {
		e.preventDefault(); // Prevent the default form submission behavior
	  
		signin(phoneNumber,setUser)
	  };
	  
	
	const handlesignup = (e: any) => {
		e.preventDefault(); 
		signup(username, phoneNumber,setUser);
	
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
					background: "black",
					fontFamily: 'sans-serif',
				}}
			>
				<div
					className='main'
				>
					<input type="checkbox" id="chk" aria-hidden="true" />

					<div className="signup"	>
						<form onSubmit={(e)=>{handlesignup(e)}}>
							<label htmlFor="chk" aria-hidden="true">
								Sign up
							</label>
							<input onChange={(e) => {
								setusername(e.target.value);
							}} type="text" name="txt" placeholder="Username" required={true} />

							<input
								onChange={(e) => {
									setPhoneNumber(Number(e.target.value));
								}}
								type="tel"
								name="phone"
								placeholder="Phone number"
								required={true}
							/>
							<button type='submit' style={{ background: "#f7db3d" }}>signup</button>
						</form>
					</div>
					<div className="login">
						<form onSubmit={(e)=>{handleLogin(e)}}>
							<label htmlFor="chk" aria-hidden="true">
								Login
							</label>
							<input
								onChange={(e) => {
									setPhoneNumber(Number(e.target.value));
								}}
								style={{background:"#fdf1ae"}}
								type="number"
								name="phone"
								placeholder="Phone number"
								required={true}
							/>

							<button type='submit' style={{ background: "black", color: "white" }}>Login</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default AuthCard;