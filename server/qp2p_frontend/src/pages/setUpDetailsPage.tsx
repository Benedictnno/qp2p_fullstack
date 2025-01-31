import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import Autocomplete from "../components/Autocomplete";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AppDispatch, RootState } from "@/States/store";
import { useDispatch, useSelector } from "react-redux";
import { ProfilesDetails } from "@/States/thunks/profileDetails";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";

type FormData = {
  businessName: string;
  accountNumber: string;
  accountName: string;
  usdt: string;
  ton: string;
  solana: string;
  // Bank: string;
};
export function SetUpDetails({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [Bank, setBank] = useState("");
  const schema: ZodType<FormData> = z.object({
    businessName: z.string().min(2).max(30),
    accountNumber: z.string().min(2).max(20),
    accountName: z.string().min(2),
    usdt: z.string().min(2),
    ton: z.string().min(2),
    solana: z.string().min(2),
    // Bank: z.string().min(3),
  });
  const dispatch: AppDispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { success, error } = useSelector(
    (state: RootState) => state.profileDetails
  );
  const { toast } = useToast();

  const submitData = (data: FormData) => {
    dispatch(
      ProfilesDetails({
        businessName: data.businessName,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        bankName: Bank,
        tonRate: data.ton,
        usdtRate: data.usdt,
        bio: ""
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
      navigate("/");
    }
  };

  return (
    <>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="relative hidden bg-muted md:block">
              <img
                src="/placeholder.svg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
            <form className="p-6">
              {/* Username */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  id="businessName"
                  {...register("businessName")}
                  placeholder="Enter Business Name"
                />
                <p>{errors?.businessName?.message}</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Account Number
                </label>
                <input
                  required
                  id="accountNumber"
                  {...register("accountNumber")}
                  minLength={11}
                  maxLength={11}
                  type="number"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Account Number"
                />
                <p>{errors?.accountNumber?.message}</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Account Name
                </label>
                <p>Name that matches the Bank account</p>
                <input
                  required
                  id="accountName"
                  {...register("accountName")}
                  minLength={11}
                  maxLength={11}
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter username"
                />
                <p>{errors?.accountName?.message}</p>
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Select Bank
                </label>
                <div className="">
                  <Autocomplete setBank={setBank} />
                </div>
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
                  placeholder={`Enter token price`}
                />
                <p>{errors?.ton?.message}</p>

                <label className="block text-sm font-medium mb-2">
                  Set Usdt Price (per 1 Token)
                </label>
                <input
                  type="number"
                  className="w-full border rounded-md px-3 py-2"
                  {...register("usdt")}
                  placeholder={`Enter token price`}
                />
                <label className="block text-sm font-medium mb-2">
                  Set Solana Price (per 1 Token)
                </label>
                <input
                  type="number"
                  className="w-full border rounded-md px-3 py-2"
                  {...register("solana")}
                  placeholder={`Enter token price`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-green-500 text-white rounded-md"
                onClick={handleSubmit(submitData)}
              >
                Save
              </button>
            </form>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
      {(error || success) && <Toaster />}
    </>
  );
}
