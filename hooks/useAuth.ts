import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  BuyerSignInFormData, 
  BuyerSignUpFormData,
  SellerStep1FormData,
  SellerStep2FormData
} from "@/types/authTypes";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const router = useRouter();

  // Buyer sign in
  const buyerSignIn = async (data: BuyerSignInFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        role: "buyer",
      });
      
      if (result?.error) {
        setError("Invalid email or password");
        return false;
      }
      
      router.push("/");
      return true;
    } catch (error) {
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Buyer sign up
  const buyerSignUp = async (data: BuyerSignUpFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/auth/buyer/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error || "Failed to create account");
        return false;
      }
      
      // Automatically sign in after successful sign up
      return await buyerSignIn({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP
  const sendOTP = async (phone: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error || "Failed to send OTP");
        return false;
      }
      
      // If we have the OTP in development mode, show it
      if (result.otp && process.env.NODE_ENV === "development") {
        console.log("Development OTP:", result.otp);
      }
      
      return true;
    } catch (error) {
      setError("Failed to send OTP");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Seller step 1 - Updated to use the step1 specific endpoint
  const sellerStep1 = async (data: SellerStep1FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Submit step 1 data to the step1-specific endpoint
      const response = await fetch("/api/auth/seller/sign-up/step1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error || "Failed to process step 1");
        return false;
      }
      
      // Store validated data for step 2
      setSessionData(result.validatedData);
      return true;
    } catch (error) {
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Seller step 2 - Updated to use the step2 specific endpoint
  const sellerStep2 = async (data: SellerStep2FormData) => {
    setIsLoading(true);
    setError(null);
    
    if (!sessionData) {
      setError("Missing session data from step 1");
      setIsLoading(false);
      return false;
    }
    
    try {
      const response = await fetch("/api/auth/seller/sign-up/step2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          step1Data: sessionData
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error || "Failed to create seller account");
        return false;
      }
      
      // Automatically sign in after successful sign up
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: sessionData.email,
        password: data.password,
        role: "seller",
      });
      
      if (signInResult?.error) {
        setError("Account created but sign-in failed");
        return false;
      }
      
      router.push("/seller-dashboard");
      return true;
    } catch (error) {
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Seller sign in
  const sellerSignIn = async (data: BuyerSignInFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        role: "seller",
      });
      
      if (result?.error) {
        setError("Invalid email or password");
        return false;
      }
      
      router.push("/seller-dashboard");
      return true;
    } catch (error) {
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    buyerSignIn,
    buyerSignUp,
    sellerSignIn,
    sellerStep1,
    sellerStep2,
    sendOTP,
    sessionData,
  };
};