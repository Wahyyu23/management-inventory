"use client";

import { FiBox } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginFormValues } from "../schema/auth.schema";

import { login } from "../services/auth.service";

import type { LoginResult } from "../types/auth.types";
import { saveAuthSession } from "../utils/auth-session";

export function LoginScreen() {
  const [loginError, setLoginError] = useState<string | null>(null);

  const [loginResult, setLoginResult] = useState<LoginResult | null>(null);

  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      username: "",
      password: "",
    },

    mode: "onTouched",
  });

  async function handleLogin(values: LoginFormValues) {
    try {
      setLoginError(null);
      setLoginResult(null);

      const response = await login({
        username: values.username,
        password: values.password,
      });

      saveAuthSession(response.data);

      setLoginResult(response.data);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Login Failed");
    } 
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden bg-primary lg:flex">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary-foreground/10" />

          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-primary-foreground/10" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <div className="flex items-center gap-3 text-primary-foreground">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary-foreground/10">
                <FiBox className="size-5" />
              </div>

              <span className="font-semibold">Management Inventory</span>
            </div>

            <div className="max-w-xl text-primary-foreground">
              <h1 className="text-display font-semibold leading-tight">
                Manage inventory with clarity and control.
              </h1>

              <p className="mt-5 max-w-lg text-body text-primary-foreground/75">
                Centralized inventory management designed to support product
                tracking, RFID-based units, borrowing, and returns.
              </p>
            </div>

            <p className="text-small text-primary-foreground/60">
              Inventory Management System
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-8 py-12 lg:px-12 xl:px-16">
          <div className="w-full max-w-[var(--login-form-max-width)]">
            <div>
              <p className="text-small font-medium text-primary">
                Management Inventory
              </p>

              <h2 className="mt-2 text-page-title font-semibold tracking-tight text-foreground">
                Welcome
              </h2>

              <p className="mt-2 text-small text-muted-foreground">
                Enter your account credentials to continue.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(handleLogin)}
              className="mt-8 space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>

                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="h-11"
                  autoComplete="username"
                  {...register("username")}
                />

                {errors.username && (
                  <p className="text-sm text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>

                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-11"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {loginError && (
                <div className="rounded-lg border border-destructive p-3">
                  <p className="text-sm text-destructive">{loginError}</p>
                </div>
              )}

              <Button
                type="submit"
                className="h-11 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {loginResult && (
              <div className="mt-5 rounded-lg border border-border p-4">
                <p className="text-sm font-semibold text-foreground">
                  Login successful
                </p>

                <div className="mt-3 space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">User:</span>{" "}
                    {loginResult.user.name}
                  </p>

                  <p>
                    <span className="text-muted-foreground">User ID:</span>{" "}
                    {loginResult.user.id}
                  </p>

                  <p>
                    <span className="text-muted-foreground">Role:</span>{" "}
                    {loginResult.user.role}
                  </p>

                  <p>
                    <span className="text-muted-foreground">Token:</span>{" "}
                    <span className="font-mono">
                      {loginResult.access_token.slice(0, 24)}
                      ...
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
