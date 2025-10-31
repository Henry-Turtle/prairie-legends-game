import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { z } from "zod";
import prairieLegendsLogo from "../assets/prairie-legends-logo.png";

const formSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address").min(1, "Email is required")
});

interface EmailOptInProps {
  onComplete: () => void;
}

export const EmailOptIn = ({ onComplete }: EmailOptInProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = formSchema.safeParse({ fullName, email });
    
    if (!result.success) {
      const fieldErrors: { fullName?: string; email?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as "fullName" | "email";
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    onComplete();
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-amber-100 relative overflow-hidden">
      {/* Prairie background elements */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-600 to-green-400" />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center backdrop-blur-sm bg-white/90 rounded-2xl p-12 shadow-lg border border-amber-200 max-w-md w-full mx-4">
          <img 
            src={prairieLegendsLogo} 
            alt="Prairie Legends Logo" 
            className="w-48 h-auto mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Prairie Legends Turkey Hunt
          </h1>
          <p className="text-gray-600 mb-6">
            Enter your email to join the giveaway and join our hunting community!
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-left">
              <Label htmlFor="fullName" className="text-gray-700">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="mt-1"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>
            
            <div className="text-left">
              <Label htmlFor="email" className="text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hunter@example.com"
                className="mt-1"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isLoading ? "Joining..." : "Join Hunt"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                Skip
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};