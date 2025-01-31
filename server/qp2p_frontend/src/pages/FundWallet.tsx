import { PaystackButton } from "react-paystack";
import axios from "axios";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";

type FormData = {
  phone: string;
  email: string;
  amount: string;
  Bank: string;
};
type PayStack = {
  children: string;
  Phone: string;
  amount: number;
  email: string;
  metadata: {
    name: string;
    Phone: string;
    custom_fields: [
      {
        display_name: string;
        variable_name: string;
        value: string;
      }
    ];
  };
  publicKey: string;
  text: string;
  onSuccess: () => Promise<void>;
  onClose: () => void;
  className: string;
};

type PhoneAmountType = {
  phone: string;
  amount: number;
};

function FundWallet() {
  const [PhoneAmount, setPhoneAmount] = useState<PhoneAmountType>({
    phone: "",
    amount: 0,
  });
  const publicKey = "pk_test_9a831cd226cc5a7644fa007c994675cfb53ec031";

  const schema: ZodType<FormData> = z.object({
    phone: z.string().min(2).max(11),
    email: z.string().email(),
    amount: z.string(),
    Bank: z.string().min(3),
  });

  const sessionUser = localStorage.getItem("user");

  const { user } = sessionUser ? JSON.parse(sessionUser) : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

   const handleChange = (e : ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target; // Destructure the name and value from the input
    setPhoneAmount((prev) => ({
      ...prev, // Spread the previous state
      [name]: value, // Update the changed field
    }));
  };

  const style = {
    input:
      "block w-full px-4 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:border-primary-500",
    button:
      "block w-full px-4 py-2 bg-[#72bff1] rounded-lg text-[#fff] font-bold text-xl",
  };
  const componentProps: PayStack = {
    className: style.button,
    children: "Pay Now",
    email: user.email,
    amount: PhoneAmount.amount * 100,
    Phone: PhoneAmount.phone,
    metadata: {
      name: user.name,
      Phone: PhoneAmount.phone,
      custom_fields: [
        {
          display_name: "Phone Number",
          variable_name: "phone",
          value: "1234567890",
        },
      ],
    },
    publicKey,
    text: "Pay Now",
    onSuccess: () => payment(),
    onClose: () => alert("Wait! complete the transaction!!"),
  };

  const payment = async () => {
    await axios.post("http://localhost:5000/api/v1/fiat/fund", {
      amt: PhoneAmount.amount,
      user: user.id,
      email: user.email,
      name: user.name,
      token: "Funded Account",
      quantity: PhoneAmount.amount,
    });
  };

  const submitData = (data: FormData) => {
    
    setPhoneAmount((prev:any) => ({
      ...prev,
      amount: data.amount,
      phone: data.phone,
    }));
  };

  return (
    <form className="p-6">
      {/* Username */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Email address</label>
        <input
          type="text"
          className="w-full border rounded-md px-3 py-2"
          id="businessName"
          {...register("email")}
          value={user.email}
          readOnly
          placeholder="Enter Business Name"
        />
        <p>{errors?.email?.message}</p>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Phone Number</label>
        <input
          required
          id="phone"
        
        name="phone"
        onChange={handleChange}
          minLength={11}
          maxLength={11}
          type="number"
          className="w-full border rounded-md px-3 py-2"
          placeholder="Phone Number"
        />
        <p>{errors?.phone?.message}</p>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Amount</label>
        <input
          required
          id="amount"
         name="amount"
        onChange={handleChange}
          minLength={11}
          maxLength={11}
          type="number"
          // value={PhoneAmount.amount}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Enter amount"
        />
        <p>{errors?.amount?.message}</p>
      </div>
      <button type="submit" onClick={handleSubmit(submitData)}>
      
        <PaystackButton {...componentProps} />
      </button>
    </form>
  );
}

export default FundWallet;
