"use client";

import React, { useState } from "react";
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
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();
  const [pending, setPending] = useState<boolean>(false);
  const [signUpError, setSignUpError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>();

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    setPending(true);
    const { name, email, password } = data;
    signIn("password", { name, email, password, flow: "signUp" })
      .then(() => {
        router.push("/");
      })
      .catch(() => {
        setSignUpError("Something went wrong");
      })
      .finally(() => {
        setPending(false);
      });
  };

  const handleProviderSignIn = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!signUpError && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{signUpError}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
          <div className="space-y-1">
            <Input
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              placeholder="Full name"
              type="text"
            />
            {errors.name && (
              <p className="text-red-500 text-xs h-4">{errors.name.message}</p>
            )}
          </div>

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

          <div className="space-y-1 relative">
            <Input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 mb-1.5" />
              ) : (
                <Eye className="h-5 w-5 mb-1.5" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs h-4">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1 relative">
            <Input
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              placeholder="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
            />
            <button
              type="button"
              onClick={toggleShowConfirmPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 mb-1.5" />
              ) : (
                <Eye className="h-5 w-5 mb-1.5" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs h-4">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            disabled={isSubmitting || pending}
          >
            {isSubmitting ? "Signing up..." : "Continue"}
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            onClick={() => handleProviderSignIn("google")}
            variant="outline"
            size="lg"
            className="w-full relative"
            disabled={isSubmitting || pending}
          >
            <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
            Continue with Google
          </Button>
          <Button
            onClick={() => handleProviderSignIn("github")}
            variant="outline"
            size="lg"
            className="w-full relative"
            disabled={isSubmitting || pending}
          >
            <FaGithub className="size-5 absolute top-2.5 left-2.5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <span
            onClick={() => setState("signIn")}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
