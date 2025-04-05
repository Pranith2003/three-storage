"use client";

import React from "react";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useAtom } from "jotai";
import { accountIdAtom } from "@/lib/atom";
import { useRouter } from "next/navigation";

interface RegisterProps {
  email: string;
  name: string;
}

const RegisterForm = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<RegisterProps>();
  const [id] = useAtom(accountIdAtom);
  const onSubmit = async (data: RegisterProps) => {
    try {
      const response = await axios.post("/api/user", {
        user_name: data.name,
        user_email: data.email,
        user_account_id: id,
      });
      if (response.status === 201) {
        console.log("User created successfully");
      }
      console.log(response.data.message);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  return (
    <>
      <Card className="w-full mx-auto shadow-xl rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Register</CardTitle>
          <CardDescription className="text-center text-sm text-gray-500">
            Enter your details to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input {...register("email")} placeholder="Email" type="email" />
            <Input {...register("name")} placeholder="Name" type="text" />
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/")}
            className="ml-1 text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </CardFooter>
      </Card>
    </>
  );
};

export default RegisterForm;
