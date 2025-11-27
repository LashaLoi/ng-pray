"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/configs/supabase/server";

export type AuthActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const createOriginCallbackUrl = async () => {
  const origin = (await headers()).get("origin");

  if (origin) {
    return `${origin}/auth/callback`;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;
  }

  return undefined;
};

export const signInWithGoogle = async () => {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (!data.url) return;

  redirect(data.url);
};

const validateCredentials = (email: string, password: string) => {
  if (!email || !password) {
    return "Email and password are required.";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  return null;
};

export const signInWithEmail = async (
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> => {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const validationError = validateCredentials(email, password);
  if (validationError) {
    return { status: "error", message: validationError };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/");

  return { status: "success", message: "Successfully signed in." };
};

export const signUpWithEmail = async (
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> => {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password !== confirmPassword) {
    return { status: "error", message: "Passwords do not match." };
  }

  const validationError = validateCredentials(email, password);
  if (validationError) {
    return { status: "error", message: validationError };
  }

  const supabase = await createClient();

  const emailRedirectTo = await createOriginCallbackUrl();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/");

  return {
    status: "success",
    message: "Account created. Check your inbox to confirm the email.",
  };
};

export const getMe = async () => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  return user;
};

type TimerResponse = {
  count: string;
};

export const getCount = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const result = await supabase
    .from("timer")
    .select("count")
    .eq("id", user.id)
    .overrideTypes<TimerResponse[]>();

  return result.data?.[0] ?? null;
};

export const saveCount = async (count: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const result = await supabase
    .from("timer")
    .upsert({
      id: user.id,
      count,
    })
    .select("count")
    .overrideTypes<TimerResponse[]>();

  return result.data?.[0] ?? null;
};
