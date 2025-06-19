import { useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export function AuthForm({ onAuth }) {
  // State for auth method selection
  const [tab, setTab] = useState("magic_link");
  const supabase = createClient();

  // Common states
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Email states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone states
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneMode, setPhoneMode] = useState("login");

  const resetAll = () => {
    setEmail("");
    setPassword("");
    setPhone("");
    setOtp("");
    setOtpSent(false);
    setError(null);
    setLoading(false);
  };

  // --- Magic Link (Email) ---
  async function handleMagicLink(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email) {
      setError("Please enter your email.");
      setLoading(false);
      return;
    }
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) {
      setError(error.message);
    } else {
    toast({
        title: "Magic Link Sent!",
        description: "Check your email for a login link."
      });
    setEmail("");
    }
    setLoading(false);
  }

  // --- Email/Password (Login or Signup) ---
  async function handleEmailAuth(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // if (!email || !password) {
    //   setError("Email and password are required.");
    //   setLoading(false);
    //   return;
    // }
    // if (tab === "login") {
    //   const { error } = await supabase.auth.signInWithPassword({
    //     email, password,
    //   });
    //   if (error) {
    //     setError(error.message);
    //   } else {
    //     toast({ title: "Logged in successfully!" });
    //     onAuth && onAuth();
    //   }
    // } else {
    //   const redirectTo = `${window.location.origin}/`;
    //   const { error } = await supabase.auth.signUp({
    //     email, password,
    //     options: { emailRedirectTo: redirectTo },
    //   });
    //   if (error) {
    //     setError(error.message);
    //   } else {
    //     toast({
    //       title: "Registration successful!",
    //       description: "Check your email for a confirmation link.",
    //     });
    //     setTab("login");
    //     setEmail("");
    //     setPassword("");
    //   }
    // }
    setLoading(false);
  }

  // --- Phone (SMS OTP) ---
  async function handleSendOtp(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!phone) {
      setError("Please enter your phone number.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      setError(error.message);
    } else {
      setOtpSent(true);
      toast({ title: "OTP sent!", description: "Check your phone for the code." });
    }
    setLoading(false);
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!phone || !otp) {
      setError("Phone and OTP code required.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms"
    });
    if (error) {
      setError(error.message);
    } else {
      toast({ title: "Logged in successfully via SMS!" });
      onAuth && onAuth();
      resetAll();
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-8 space-y-6 animate-fade-in-up">
      <div className="flex justify-center font-bold text-2xl gap-2">
        <span className="text-blue-600">Highland</span>
        <span className="text-orange-500">Cargo</span>
      </div>
      {/* Auth Method Tabs */}
      <div className="flex gap-2 justify-center pt-2">
        {/* <Button
          variant={tab === "login" ? "default" : "outline"}
          size="sm"
          onClick={() => { resetAll(); setTab("login"); }}
        >
          Email + Password
        </Button> */}
        {/* <Button
          variant={tab === "magic_link" ? "dark" : "outline"}
          size="sm"
          onClick={() => { resetAll(); setTab("magic_link"); }}
        >
          Magic Link
        </Button> */}
        {/* <Button
          variant={tab === "phone" ? "dark" : "outline"}
          size="sm"
          onClick={() => { resetAll(); setTab("phone"); }}
        >
          Phone (SMS OTP)
        </Button> */}
      </div>
      {/* Tab Forms */}
      {tab === "magic_link" && (
        <form className="space-y-5" onSubmit={handleMagicLink}>
          <div>
            <label className="block text-sm mb-1 font-semibold text-gray-700" htmlFor="otp-email">
              Email address
            </label>
            <Input
              id="otp-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. you@email.com"
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button variant={"dark"} className="w-full mt-4" type="submit" disabled={loading}>
            {loading ? "Sending Magic Link…" : "Send Magic Link"}
          </Button>
        </form>
      )}
      {/* {(tab === "login" || tab === "signup") && (
        <>
          <div className="flex gap-1 mb-[-0.5rem]">
            <Button
              variant={tab === "login" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setTab("login")}
              type="button"
            >
              Login
            </Button>
            <Button
              variant={tab === "signup" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setTab("signup")}
              type="button"
            >
              Sign Up
            </Button>
          </div>
          <form className="space-y-5" onSubmit={handleEmailAuth}>
            <div>
              <label className="block text-sm mb-1 font-semibold text-gray-700" htmlFor="auth-email">
                Email address
              </label>
              <Input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. you@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-semibold text-gray-700" htmlFor="auth-password">
                Password
              </label>
              <Input
                id="auth-password"
                type="password"
                autoComplete={tab === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button className="w-full mt-4" type="submit" disabled={loading}>
              {loading
                ? tab === "login"
                  ? "Logging in…"
                  : "Signing up…"
                : tab === "login"
                  ? "Login"
                  : "Sign Up"
              }
            </Button>
          </form>
        </>
      )} */}
      {/* {tab === "phone" && (
        <form className="space-y-5" onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          <div>
            <label className="block text-sm mb-1 font-semibold text-gray-700" htmlFor="phone-num">
              Phone Number
            </label>
            <Input
              id="phone-num"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="e.g. +1234567890"
              required
              disabled={otpSent}
            />
          </div>
          {!otpSent ? (
            <Button variant="dark" className="w-full mt-4" type="submit" disabled={loading}>
              {loading ? "Sending OTP…" : "Send OTP"}
            </Button>
          ) : (
            <div className="flex flex-col space-y-3">
              <div>
                <label className="block text-sm mb-1 font-semibold text-gray-700" htmlFor="otp-code">
                  Enter Code
                </label>
                <InputOTP
                  value={otp}
                  onChange={setOtp}
                  maxLength={6}
                  containerClassName="w-full flex gap-2"
                  // You could use the InputOTPGroup/Slot for nicer styling
                  inputMode="numeric"
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot index={i} key={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <Button className="w-full mt-2" type="submit" disabled={loading}>
                {loading ? "Verifying…" : "Verify OTP & Login"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-0 underline"
                onClick={() => { setOtpSent(false); setOtp(""); setError(null); }}
              >
                Didn't get a code? Try again
              </Button>
            </div>
          )}
        </form>
      )} */}
    </div>
  );
}
