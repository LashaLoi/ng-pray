"use";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { QueryProvider } from "@/lib/configs/query";
// import { signInWithGoogle } from "@/lib/configs/supabase/server";
// import { createClient } from "@/lib/configs/supabase/server";
// import { redirect } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NG Pray",
  description: "Pray as much as you can",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const client = await createClient();
  // const { data } = await client.auth.signInWithOAuth({
  //   provider: "google",
  //   options: {
  //     redirectTo: `http://localhost:3000/auth/v1/callback`,
  //   },
  // });

  // if (data.url) {
  //   redirect(data.url); // use the redirect API for your server framework
  // }

  // console.log({ data });

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
