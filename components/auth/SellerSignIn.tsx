"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buyerSignInSchema } from "@/schemas/authSchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const SellerSignIn = () => {
  const { sellerSignIn, isLoading, error } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof buyerSignInSchema>>({
    resolver: zodResolver(buyerSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof buyerSignInSchema>) => {
    setAuthError(null);
    const result = await sellerSignIn(data);
    if (!result && error) {
      setAuthError(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input {...form.register("email")} placeholder="Email" />
      {form.formState.errors.email && (
        <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
      )}
      
      <Input {...form.register("password")} placeholder="Password" type="password" />
      {form.formState.errors.password && (
        <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
      )}
      
      {authError && (
        <p className="text-red-500 text-sm">{authError}</p>
      )}
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};

export default SellerSignIn;