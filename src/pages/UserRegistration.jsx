import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CiCircleAlert } from "react-icons/ci";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import endpoint from "../utility/axios";
import { toast } from "sonner";

export default function UserRegistration() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = async (data) => {
    try {
      console.log(data);
      const res = await endpoint.post("/users", data);
      console.log(res.data);
      toast("You are now registered 😄");
      navigate("/userLogin");
    } catch (err) {
      console.log(err);
      toast("Error occured while registering 😳");
    }
  };

  const navigate = useNavigate();

  return (
    <section className="h-screen flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Join Now and Get 50% off</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} id="create-user">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  {...register("fullName", { required: true })}
                  aria-invalid={errors.fullName ? "true" : "false"}
                />
                {errors.fullName?.type === "required" && (
                  <Alert variant="destructive">
                    <CiCircleAlert />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      user name should not be empty
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  type={"email"}
                  id="email"
                  placeholder="hello@email.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <Alert variant="destructive">
                    <CiCircleAlert />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errors.email.message}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="*********"
                  autoComplete="off"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value:
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                      message:
                        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
                    },
                  })}
                />
                {errors.password && (
                  <Alert variant="destructive">
                    <CiCircleAlert />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {errors.password.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button type="submit" form="create-user">
            Create
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
