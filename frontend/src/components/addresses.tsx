import React, { useState, useEffect } from 'react';
import { addAddress, updateAddress, getAddress, getAddresses, deleteAddress } from '../APIcalls/addressCalls';
import { PiPenBold, PiPenNibBold, PiPencilBold, PiPencilCircleLight, PiRecycleThin, PiTrashDuotone } from "react-icons/pi";

interface Address {
  id: number;
  street: string;
  housenumber: string;
  postalcode: string;
  city: string;
}
interface MyComponentProps {
  setAddressidcart: Function; // You can replace `Function` with a more specific type if you know the signature of the function
}
const AddressManager: React.FC<MyComponentProps> = ({ setAddressidcart }) => {
  const [street, setStreet] = useState('');
  const [housenumber, setHouseNumber] = useState('');
  const [postalcode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [addressID, setAddressID] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data); // Assuming the API directly returns the array of addresses
      if (data.length === 0) {
        setShowForm(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addressInfo = { street, housenumber, postalcode, city };
      if (editing && addressID) {
        await updateAddress(addressID, street, housenumber, parseInt(postalcode, 10), city);
        resetForm();
      } else {
        await addAddress(street, housenumber, parseInt(postalcode, 10), city);
        resetForm();
      }
      fetchAddresses();

    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id: number) => {
    const address = await getAddress(id);
    setAddressID(id);
    setStreet(address.street);
    setHouseNumber(address.housenumber);
    setPostalCode(address.postalcode);
    setCity(address.city);
    setEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {

    await deleteAddress(id);
    fetchAddresses();
  };

  const resetForm = () => {
    setStreet('');
    setHouseNumber('');
    setPostalCode('');
    setCity('');
    setAddressID(null);
    setEditing(false);
    setShowForm(false);
  };

  return (
    <div  className='h-[20rem] l w-full m-auto'>
      {showForm ? (
        <>
          <h2>{editing ? 'Update Address' : 'Add Address'}</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Street" required />
            <input type="text" value={housenumber} onChange={(e) => setHouseNumber(e.target.value)} placeholder="House Number" required />
            <input type="text" value={postalcode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal Code" required />
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" required />
            <div className='flex flex-row justify-center gap-4'>
            <button type="submit" className='bg-[#fff]'>{editing ? 'Update' : 'Add'} +</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </>
      ) : (
        <>

          
          <p className='text-[#fff]'>Select address</p>
          <ul className='m-8 w-[full] flex flex-wrap gap-5 overflow-auto h-[20rem] md:overflow-hidden md:h-auto '>
         
            {addresses.map((address: Address) => (
            <li key={address.id} className='h-[auto] w-[11rem] p-2 bg-[#2e2e2e8a] rounded-xl border-2 border-[#8e8e8e]' >
                <p>Address:</p>  {address.street}, {address.housenumber}, {address.postalcode}, {address.city}
                <div className='flex flex-row '>
                  <span onClick={() => handleEdit(address.id)}><PiPenBold className='w-[1.5rem] h-[1.5rem] text-[#000] bg-[#ffe159] rounded-3xl mt-6 px-1 cursor-pointer' /></span>
                  <span onClick={() => handleDelete(address.id)}><PiTrashDuotone className='w-[1.5rem] h-[1.5rem] text-[#000] bg-[#ffe159] rounded-3xl mt-6 px-1 ml-4 cursor-pointer' /></span>


                  <Addresselement
                    address={address}
                    setAddressidcart={setAddressidcart}
                    isSelected={address.id === selectedAddressId}
                    onSelected={() => setSelectedAddressId(address.id)} />

                </div>
              </li>
             
             

            ))}
            <li className=' min-h-[auto] w-[11rem] bg-[#6060608a]  text-center text-7xl rounded-xl cursor-pointer border-2 border-[#8e8e8e]' onClick={() => setShowForm(true)}>+</li>
          </ul>
        </>
      )}
    </div>
  );
};

export default AddressManager;
export function Addresselement({
  address,
  setAddressidcart,
  isSelected,
  onSelected
}: {
  address: Address,
  setAddressidcart: Function,
  isSelected: boolean,
  onSelected: () => void
}) {
  const [isChecked, setIsChecked] = useState(false);
  const toggleCheckbox = () => {
    if (isSelected) {
    
      onSelected(); 
      setAddressidcart(null);
    } else {
      
      onSelected();
      setAddressidcart(address.id);
    }
  };

  return (
    <div className='flex flex-row justify-between'>
      <div>

        <label className=" items-center cursor-pointer mt-[1.7rem] ml-4 ">
          <input
            type="checkbox"
            className="hidden"
            checked={isSelected}
            onChange={toggleCheckbox}
          />
          <span className="w-[1.2rem] h-[1.2rem]  flex items-center justify-center border border-gray-300 rounded-md">
            {isSelected && <span className='text-base'>&#10003;</span>}
          </span>
          <span className="ml-2 text-sm">Select</span>
        </label>
      </div>
    </div>
  );
}

