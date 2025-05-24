"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buyerSignUpSchema } from "@/schemas/authSchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const BuyerSignUp = () => {
  const { buyerSignUp, isLoading, error } = useAuth();
    const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof buyerSignUpSchema>>({
    resolver: zodResolver(buyerSignUpSchema),
  });

  const onSubmit = async (data: z.infer<typeof buyerSignUpSchema>) => {
    console.log("Buyer Sign Up", data);
    setAuthError(null);
    const result = await buyerSignUp(data);
    if (!result && error) {
      setAuthError(error);
    } 
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input {...form.register("name")} placeholder="Full Name" />
      <Input {...form.register("phone")} placeholder="Phone Number" />
      <Input {...form.register("email")} placeholder="Email" />
      <Input {...form.register("password")} type="password" placeholder="Password" />
      <Input {...form.register("confirmPassword")} type="password" placeholder="Confirm Password" />
      {authError && (
        <p className="text-red-500 text-sm">{authError}</p>
      )}
      <Button type="submit">{isLoading ? "Signing up..." : "Sign Up"}</Button>
    </form>
  );
};

export default BuyerSignUp;