import { FiBox } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginScreen() {
  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        {/* Branding */}
        <section className="relative hidden overflow-hidden bg-primary lg:flex">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary-foreground/10" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-primary-foreground/10" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <div className="flex items-center gap-3 text-primary-foreground">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary-foreground/10">
                <FiBox className="size-5" />
              </div>

              <span className="font-semibold">
                Management Inventory
              </span>
            </div>

            <div className="max-w-xl text-primary-foreground">
              <h1 className="text-display font-semibold leading-tight">
                Manage inventory with clarity and control.
              </h1>

              <p className="mt-5 max-w-lg text-body text-primary-foreground/75">
                Centralized inventory management designed to support
                product tracking, RFID-based units, borrowing, and returns.
              </p>
            </div>

            <p className="text-small text-primary-foreground/60">
              Inventory Management System
            </p>
          </div>
        </section>

        {/* Login */}
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

            <div className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">
                  Username
                </Label>

                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password
                </Label>

                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-11"
                  autoComplete="off"
                />
              </div>

              <Button className="h-11 w-full">
                Sign in
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}