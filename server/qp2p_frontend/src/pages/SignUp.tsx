import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { RegisterUser } from "@/States/thunks/auth";
import { AppDispatch, RootState } from "@/States/store";
import Modal from "@/utils/Model";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignUp() {
  const schema: ZodType<FormData> = z
    .object({
      firstName: z.string().min(2).max(20),
      lastName: z.string().min(2).max(20),
      email: z.string().email(),
      password: z.string().min(6).max(15),
      confirmPassword: z.string().min(6).max(15),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
const [visible , setVisible] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const submitData = (data: FormData) => {
    dispatch(
      RegisterUser({
        email: data.email,
        password: data.password,
        lastName: data.lastName,
        firstName: data.firstName,
      })
    );
  };

  const { msg, error, success, loading } = useSelector(
    (state: RootState) => state.registerUser
  );

  useEffect(() => {
    setIsModalOpen(true);
  }, [error, success]);

  if (loading) {
    return <h3>Loading...</h3>;
  }
  return (
    <>
      <Card className="mx-auto my-3 max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your details below to register for an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                required
                {...register("firstName")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                required
                {...register("lastName")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register("email")}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>

                {visible ? (
                  <FaRegEyeSlash
                    size={20}
                    className="ml-auto inline-block text-sm underline  cursor-pointer"
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <FaRegEye
                    size={20}
                    className="ml-auto inline-block text-sm underline  cursor-pointer"
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>
            <Input
              id="password"
              type={visible ? "text" : "password"}
              required
              {...register("password")}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center my-2">
              <Label htmlFor="confirmPassword"> Confirm Password</Label>
              {visible ? (
                <FaRegEyeSlash
                  size={20}
                  className="ml-auto inline-block text-sm underline  cursor-pointer"
                  onClick={() => setVisible(false)}
                />
              ) : (
                <FaRegEye
                  size={20}
                  className="ml-auto inline-block text-sm underline  cursor-pointer"
                  onClick={() => setVisible(true)}
                />
              )}
            </div>
            </div>
            <Input
              id="confirmPassword"
              type={visible ? "text" : "password"}
              required
              {...register("confirmPassword")}
              className="my-2"
            />
            {errors.confirmPassword ? (
              <p> {errors.confirmPassword.message} </p>
            ) : (
              " "
            )}
         
          <Button
            type="submit"
            className="w-full"
            onClick={handleSubmit(submitData)}
          >
            Sign Up
          </Button>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
      {success || error ? (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-semibold mb-4">Hello from QP2P</h2>
          <p className="text-gray-600 mb-4">{msg}</p>
          <button
            onClick={() => {
              setIsModalOpen(false), navigate("/login");
            }}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Return to Login Page
          </button>
        </Modal>
      ) : null}
    </>
  );
}
