"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/lib/auth/store";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

/**
 * Render an authentication modal with separate "Sign In" and "Create Account" tabs.
 *
 * Manages form state and zod validation for both login and registration flows, invokes
 * the auth store's `login` and `register` actions, displays shared error and loading
 * states, and clears/resets forms and errors when switching tabs or closing the dialog.
 *
 * @returns The JSX element for the authentication modal dialog.
 */
export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("login");
  const { login, register, isLoading, error, clearError } = useAuthStore();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleLogin = async (data: LoginData) => {
    const ok = await login(data.email, data.password);
    if (ok) {
      setOpen(false);
      loginForm.reset();
    }
  };

  const handleRegister = async (data: RegisterData) => {
    const ok = await register(
      data.email,
      data.password,
      data.firstName,
      data.lastName,
    );
    if (ok) {
      setOpen(false);
      registerForm.reset();
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      clearError();
    } else {
      loginForm.reset();
      registerForm.reset();
      clearError();
    }
  };

  const handleTabChange = (value: string) => {
    setTab(value);
    clearError();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen(true)}
        aria-label="Sign in or create account"
      >
        <UserIcon />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="top-24 grid max-h-[calc(100dvh-7rem)] translate-y-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-[2rem] border border-border-primary bg-[#F7F5F2] p-6 text-[#2E2E33] shadow-2xl ring-0 sm:max-w-sm"
          showCloseButton={false}
        >
          <DialogHeader className="gap-2">
            <DialogTitle className="text-2xl font-black leading-tight text-[#2E2E33]">
              {tab === "login" ? "Welcome back" : "Create an account"}
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-[#2E2E33]/68">
              {tab === "login"
                ? "Sign in to your account to continue."
                : "Join Nemuzoo and start your collection."}
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={tab}
            onValueChange={handleTabChange}
            className="min-h-0"
          >
            <TabsList className="h-11 w-full rounded-full bg-[#EDE9E2] p-1 text-[#2E2E33]/65">
              <TabsTrigger
                value="login"
                className="flex-1 rounded-full text-sm font-bold data-active:bg-white data-active:text-[#2E2E33] data-active:shadow-sm"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="flex-1 rounded-full text-sm font-bold data-active:bg-white data-active:text-[#2E2E33] data-active:shadow-sm"
              >
                Create Account
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="login"
              className="auth-tab-panel min-h-0 overflow-y-auto pr-1"
            >
              <form
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="flex flex-col gap-4 pt-2"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="login-email" className="text-[#2E2E33]">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-11 rounded-full border-[#2E2E33]/15 bg-white px-4 text-[#2E2E33] placeholder:text-[#8E879C] focus-visible:ring-[#A7B0C6]/45"
                    aria-invalid={!!loginForm.formState.errors.email}
                    {...loginForm.register("email")}
                  />
                  {loginForm.formState.errors.email && (
                    <span className="text-xs text-destructive">
                      {loginForm.formState.errors.email.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="login-password" className="text-[#2E2E33]">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="At least 6 characters"
                    className="h-11 rounded-full border-[#2E2E33]/15 bg-white px-4 text-[#2E2E33] placeholder:text-[#8E879C] focus-visible:ring-[#A7B0C6]/45"
                    aria-invalid={!!loginForm.formState.errors.password}
                    {...loginForm.register("password")}
                  />
                  {loginForm.formState.errors.password && (
                    <span className="text-xs text-destructive">
                      {loginForm.formState.errors.password.message}
                    </span>
                  )}
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  type="submit"
                  variant="warm"
                  size="md"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent
              value="register"
              className="auth-tab-panel min-h-0 overflow-y-auto pr-1"
            >
              <form
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="flex flex-col gap-4 pt-2"
              >
                <div className="flex gap-3">
                  <div className="flex flex-col gap-2 flex-1">
                    <Label htmlFor="reg-first" className="text-[#2E2E33]">First Name</Label>
                    <Input
                      id="reg-first"
                      placeholder="First"
                      className="h-11 rounded-full border-[#2E2E33]/15 bg-white px-4 text-[#2E2E33] placeholder:text-[#8E879C] focus-visible:ring-[#A7B0C6]/45"
                      aria-invalid={!!registerForm.formState.errors.firstName}
                      {...registerForm.register("firstName")}
                    />
                    {registerForm.formState.errors.firstName && (
                      <span className="text-xs text-destructive">
                        {registerForm.formState.errors.firstName.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <Label htmlFor="reg-last" className="text-[#2E2E33]">Last Name</Label>
                    <Input
                      id="reg-last"
                      placeholder="Last"
                      className="h-11 rounded-full border-[#2E2E33]/15 bg-white px-4 text-[#2E2E33] placeholder:text-[#8E879C] focus-visible:ring-[#A7B0C6]/45"
                      aria-invalid={!!registerForm.formState.errors.lastName}
                      {...registerForm.register("lastName")}
                    />
                    {registerForm.formState.errors.lastName && (
                      <span className="text-xs text-destructive">
                        {registerForm.formState.errors.lastName.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-email" className="text-[#2E2E33]">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-11 rounded-full border-[#2E2E33]/15 bg-white px-4 text-[#2E2E33] placeholder:text-[#8E879C] focus-visible:ring-[#A7B0C6]/45"
                    aria-invalid={!!registerForm.formState.errors.email}
                    {...registerForm.register("email")}
                  />
                  {registerForm.formState.errors.email && (
                    <span className="text-xs text-destructive">
                      {registerForm.formState.errors.email.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-password" className="text-[#2E2E33]">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="At least 6 characters"
                    className="h-11 rounded-full border-[#2E2E33]/15 bg-white px-4 text-[#2E2E33] placeholder:text-[#8E879C] focus-visible:ring-[#A7B0C6]/45"
                    aria-invalid={!!registerForm.formState.errors.password}
                    {...registerForm.register("password")}
                  />
                  {registerForm.formState.errors.password && (
                    <span className="text-xs text-destructive">
                      {registerForm.formState.errors.password.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-confirm" className="text-[#2E2E33]">Confirm Password</Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    placeholder="Repeat your password"
                    className="h-11 rounded-full border-[#2E2E33]/15 bg-white px-4 text-[#2E2E33] placeholder:text-[#8E879C] focus-visible:ring-[#A7B0C6]/45"
                    aria-invalid={
                      !!registerForm.formState.errors.confirmPassword
                    }
                    {...registerForm.register("confirmPassword")}
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <span className="text-xs text-destructive">
                      {registerForm.formState.errors.confirmPassword.message}
                    </span>
                  )}
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  type="submit"
                  variant="warm"
                  size="md"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
