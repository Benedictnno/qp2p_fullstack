import React, { useEffect, useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AppDispatch, RootState } from "@/States/store";
import { useDispatch, useSelector } from "react-redux";
import { ProfilesDetails } from "@/States/thunks/profileDetails";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";
// interface URL {
//   id: number;
//   url: string;
// }

// interface FormData {
//   businessName: string;
//   accountNumber: Number;
//   accountName: string;
//   usdt: Number;
//   ton: Number;
//   bankName: string;
//   solana: Number;
// }


const ProfileForm: React.FC = () => {
  // const [urls, setUrls] = useState<URL[]>([]);
  // const [newUrl, setNewUrl] = useState<string>("");
  
  
  const formSchema = z.object({
    businessName: z.string().default(""),
    accountNumber: z.number().default(0),
    accountName: z.string().default(""),
    bankName: z.string().default(""),
    bio: z.string().default(""),
    usdt: z.number().default(0),
    ton: z.number().default(0),
    solana: z.number().default(0),
  });
  type FormData = z.infer<typeof formSchema>;
  const dispatch: AppDispatch = useDispatch();
const [formData, setFormData] = useState<FormData>(formSchema.parse({}));
  const [editing, setEditing] = useState(false);

  // Fetch default values from the API
  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/user/full-details",
          {
            withCredentials: true,
          }
        ); // Replace with your API endpoint
        const defaultData = formSchema.parse(response.data.userDetails); // Validate the data with Zod
         setFormData(defaultData);
      } catch (error) {
        console.error("Error fetching default values:", error);
      } finally {
        (false);
      }
    };

    fetchDefaults();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { success, error } = useSelector(
    (state: RootState) => state.profileDetails
  );
  const { toast } = useToast();

const handleChange = (
  event: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >
) => {
  const { name, value } = event.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

  const submitData = (data: FormData) => {
    dispatch(
      ProfilesDetails({
        businessName: data.businessName,
        accountName: data.accountName,
        bio: data.bio,
        accountNumber: String(data.accountNumber),
        bankName: data.bankName,
        tonRate: String(data.ton),
        usdtRate: String(data.usdt),
      })
    );
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "ERROR , go through the form before submitting",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
    if (success) {
      toast({
        variant: "default",
        title: "Success",
        description: "Your Details has ben successfully saved",
        action: <ToastAction altText="Try again">Done</ToastAction>,
      });
    }
  };

  return (
    <>
      <form className="p-6">
        {/* Username */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Business Name
          </label>
          <input
            readOnly={editing ? false : true}
            type="text"
            className="w-full border rounded-md px-3 py-2"
            id="businessName"
            value={formData["businessName" as keyof FormData]}
            {...register("businessName")}
            placeholder="Enter Business Name"
            onChange={handleChange}
          />
          <p>{errors?.businessName?.message}</p>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Account Number
          </label>
          <input
            required
            readOnly={editing ? false : true}
            id="accountNumber"
            {...register("accountNumber")}
            minLength={11}
            maxLength={11}
            type="number"
            value={formData["accountNumber" as keyof FormData]}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Account Number"
            onChange={handleChange}
          />
          <p>{errors?.accountNumber?.message}</p>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Account Name</label>
          <p>Name that matches the Bank account</p>
          <input
            required
            id="accountName"
            readOnly={editing ? false : true}
            {...register("accountName")}
            minLength={11}
            maxLength={11}
            type="text"
            value={formData["accountName" as keyof FormData]}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Enter username"
            onChange={handleChange}
          />
          <p>{errors?.accountName?.message}</p>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Bank's Name</label>
          <p>Please Make sure the name of the bank is spelt correctly</p>
          <input
            required
            id="bankName"
            {...register("bankName")}
            readOnly={editing ? false : true}
            minLength={11}
            maxLength={11}
            type="text"
            value={formData["bankName" as keyof FormData]}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Enter bankName"
            onChange={handleChange}
          />
          <p>{errors?.bankName?.message}</p>
        </div>

        {/* set token price */}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            {" "}
            Set Ton Price (per 1 Token)
          </label>
          <input
            type="number"
            className="w-full border rounded-md px-3 py-2"
            {...register("ton")}
            readOnly={editing ? false : true}
            value={formData["ton" as keyof FormData]}
            placeholder={`Enter token price`}
            onChange={handleChange}
          />
          <p>{errors?.ton?.message}</p>

          <label className="block text-sm font-medium mb-2">
            Set Usdt Price (per 1 Token)
          </label>
          <input
            type="number"
            className="w-full border rounded-md px-3 py-2"
            {...register("usdt")}
            readOnly={editing ? false : true}
            value={formData["usdt" as keyof FormData]}
            placeholder={`Enter token price`}
            onChange={handleChange}
          />
          <label className="block text-sm font-medium mb-2">
            Set Solana Price (per 1 Token)
          </label>
          <input
            type="number"
            className="w-full border rounded-md px-3 py-2"
            value={formData["solana" as keyof FormData]}
            {...register("solana")}
            readOnly={editing ? false : true}
            placeholder={`Enter token price`}
            onChange={handleChange}
          />
        </div>
        {/* Bio */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            className="w-full border rounded-md px-3 py-2"
            value={formData["bio" as keyof FormData]}
            readOnly={editing ? false : true}
            {...register("bio")}
            placeholder="Enter your bio"
            onChange={handleChange}
          />
        </div> 

      </form>
        {editing ? (
          <button
           
            className="w-full py-2 bg-green-500 text-white rounded-md"
            onClick={()=>(setEditing(false),handleSubmit(submitData))}
          >
            Save Edit
          </button>
        ) : (
          <button
          type="button"
            className="w-full py-2 bg-green-500 text-white rounded-md"
            onClick={()=>setEditing(true)}
          >
            Edit Profile
          </button>
        )}

      {(error || success) && <Toaster />}
    </>
  );
};

export default ProfileForm;
