"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { SignInFlow } from "../types";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

interface FormData {
  email: string;
  password: string;
}

const SignInCard = ({ setState }: SignInCardProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // Handle form submission here
    console.log(data);
    // Add your authentication logic here
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
          <div className="space-y-1">
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email address",
                },
              })}
              placeholder="Email"
              type="email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs h-4">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Password"
              type="password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs h-4">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Continue"}
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            onClick={() => {}}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
            Continue with Google
          </Button>
          <Button
            onClick={() => {}}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FaGithub className="size-5 absolute top-2.5 left-2.5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => setState("signUp")}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
