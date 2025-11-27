"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, User2, UserPlus, X } from "lucide-react";

import {
  type AuthActionState,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/api";
import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Input } from "./input";

const INITIAL_STATE: AuthActionState = { status: "idle" };

const googleIconClasses =
  "size-4 shrink-0 text-[#4285F4] [--g-blue:#4285F4] [--g-red:#EA4335] [--g-yellow:#FBBC04] [--g-green:#34A853]";

const GoogleIcon = () => (
  <svg
    className={googleIconClasses}
    viewBox="0 0 18 18"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="#EA4335"
      d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.81.89 11.66 0 9 0 5.48 0 2.44 2.02.96 4.96l2.96 2.3C4.5 5.21 6.57 3.48 9 3.48Z"
    />
    <path
      fill="#34A853"
      d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.83 2.92l2.82 2.18c1.69-1.56 2.69-3.86 2.69-6.6Z"
    />
    <path
      fill="#4A90E2"
      d="M3.92 10.74c-.24-.71-.38-1.47-.38-2.24s.14-1.53.37-2.24L.96 3.96C.32 5.27 0 6.61 0 8s.32 2.73.96 4.04l2.96-2.3Z"
    />
    <path
      fill="#FBBC05"
      d="M9 18c2.43 0 4.48-.8 5.97-2.18l-2.82-2.18c-.76.53-1.78.9-3.15.9-2.43 0-4.5-1.73-5.24-4.09L.96 12.04C2.44 15 5.48 18 9 18Z"
    />
  </svg>
);

export const AuthModal = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const [signInState, signInAction, isSigningIn] = useActionState(
    signInWithEmail,
    INITIAL_STATE
  );
  const [signUpState, signUpAction, isSigningUp] = useActionState(
    signUpWithEmail,
    INITIAL_STATE
  );

  const { pending, state, action, cta } = useMemo(() => {
    if (mode === "login") {
      return {
        pending: isSigningIn,
        state: signInState,
        action: signInAction,
        cta: "Log in",
      };
    }

    return {
      pending: isSigningUp,
      state: signUpState,
      action: signUpAction,
      cta: "Create account",
    };
  }, [
    isSigningIn,
    signInState,
    signInAction,
    isSigningUp,
    signUpState,
    signUpAction,
    mode,
  ]);

  useEffect(() => {
    if (state.status !== "success") return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
    setMode("login");
    router.refresh();
  }, [state.status, router]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setMode("login");
  };

  return (
    <>
      <Button
        variant="secondary"
        className="absolute right-6 top-6 shadow-sm"
        onClick={handleOpen}
      >
        <User2 />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleClose}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-background/95 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  NG Pray
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {mode === "login" ? "Welcome back" : "Create your account"}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                aria-label="Close"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="mb-5 flex gap-2 rounded-full bg-muted p-1 text-sm font-medium">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 transition",
                  mode === "login"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                <LogIn className="size-4" />
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 transition",
                  mode === "register"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                <UserPlus className="size-4" />
                Register
              </button>
            </div>

            <form action={action} className="space-y-4">
              <label className="space-y-1 text-sm font-medium text-foreground">
                Email
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </label>

              <label className="space-y-1 text-sm font-medium text-foreground">
                Password
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  minLength={6}
                  required
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
              </label>

              {mode === "register" && (
                <label className="space-y-1 text-sm font-medium text-foreground">
                  Confirm password
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    minLength={6}
                    required
                    autoComplete="new-password"
                  />
                </label>
              )}

              <Button type="submit" className="w-full mt-2" disabled={pending}>
                {pending ? "Please wait..." : cta}
              </Button>

              {state.message && (
                <p
                  role="status"
                  className={cn(
                    "text-sm",
                    state.status === "error"
                      ? "text-destructive"
                      : "text-emerald-600"
                  )}
                >
                  {state.message}
                </p>
              )}
            </form>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              Or continue with
              <span className="h-px flex-1 bg-border" />
            </div>

            <form action={signInWithGoogle}>
              <Button type="submit" variant="outline" className="w-full">
                <GoogleIcon />
                Continue with Google
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
