"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buyerSignInSchema, BuyerSignInData } from "@/schemas/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import Link from "next/link";

const BuyerSignIn = () => {
  const { buyerSignIn, isLoading, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<BuyerSignInData>({
    resolver: zodResolver(buyerSignInSchema),
  });

  const onSubmit = async (data: BuyerSignInData) => {
    console.log("Buyer Sign In", data);
    setIsSubmitting(true);
    clearError();
    clearErrors();

    try {
      const result = await buyerSignIn(data.email, data.password);

      if (!result.success && result.error) {
        // Handle specific errors
        if (result.error.includes("No buyer found")) {
          setError("email", { 
            type: "manual", 
            message: "No account found with this email" 
          });
        } else if (result.error.includes("Invalid password")) {
          setError("password", { 
            type: "manual", 
            message: "Incorrect password" 
          });
        }
        // Generic error will be shown from useAuth hook
      }
      // Success case is handled in useAuth hook (redirect to /shop)
    } catch (err) {
      console.error("Sign in error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input 
            {...register("email")}
            type="email"
            placeholder="Email" 
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input 
            {...register("password")}
            type="password" 
            placeholder="Password" 
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/auth/buyer/signup" className="text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default BuyerSignIn;