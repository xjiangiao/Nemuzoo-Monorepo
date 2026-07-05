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
    newsletterOptIn: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

const labelClass = "text-text-primary";
const inputClass =
  "h-11 rounded-full border-border-primary bg-surface-elevated px-4 text-text-primary placeholder:text-text-muted focus-visible:ring-accent/45";
const tabTriggerClass =
  "relative z-10 flex-1 rounded-full bg-transparent text-sm font-bold text-text-secondary transition-colors data-active:bg-transparent data-active:text-text-primary data-active:shadow-none";
const submitButtonClass =
  "w-full disabled:border disabled:border-border-primary disabled:bg-surface-secondary disabled:text-text-secondary disabled:opacity-100";

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
      newsletterOptIn: false,
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
      Boolean(data.newsletterOptIn),
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Sign in or create account"
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center text-text-secondary transition-colors hover:text-text-primary"
      >
        <UserIcon size={20} />
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="top-24 grid max-h-[calc(100dvh-7rem)] translate-y-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-[2rem] border border-border-primary bg-surface-primary p-6 text-text-primary shadow-2xl ring-0 sm:max-w-sm"
          showCloseButton={false}
        >
          <DialogHeader className="gap-2">
            <DialogTitle className="text-2xl font-black leading-tight text-text-primary">
              {tab === "login" ? "Welcome back" : "Create an account"}
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-text-secondary">
              {tab === "login"
                ? "Sign in to your account to continue."
                : "Join Nemuzoo and keep your order details close."}
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={tab}
            onValueChange={handleTabChange}
            className="min-h-0"
          >
            <TabsList className="relative h-11 w-full overflow-hidden rounded-full bg-surface-secondary p-1 text-text-secondary">
              <span
                aria-hidden="true"
                className={`absolute bottom-1 left-1 top-1 w-[calc(50%-0.25rem)] rounded-full bg-surface-primary shadow-sm transition-transform duration-200 ease-out ${
                  tab === "register" ? "translate-x-full" : "translate-x-0"
                }`}
              />
              <TabsTrigger
                value="login"
                className={tabTriggerClass}
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className={tabTriggerClass}
              >
                Create Account
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="login"
              className="auth-tab-panel -mx-1 min-h-0 overflow-y-auto px-1 pb-1"
            >
              <form
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="flex flex-col gap-4 pt-3"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="login-email" className={labelClass}>Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass}
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
                  <Label htmlFor="login-password" className={labelClass}>Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="At least 6 characters"
                    className={inputClass}
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
                  className={submitButtonClass}
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
              className="auth-tab-panel -mx-1 min-h-0 overflow-y-auto px-1 pb-1"
            >
              <form
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="flex flex-col gap-4 pt-3"
              >
                <div className="flex gap-3">
                  <div className="flex flex-col gap-2 flex-1">
                    <Label htmlFor="reg-first" className={labelClass}>First Name</Label>
                    <Input
                      id="reg-first"
                      placeholder="First"
                      className={inputClass}
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
                    <Label htmlFor="reg-last" className={labelClass}>Last Name</Label>
                    <Input
                      id="reg-last"
                      placeholder="Last"
                      className={inputClass}
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
                  <Label htmlFor="reg-email" className={labelClass}>Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass}
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
                  <Label htmlFor="reg-password" className={labelClass}>Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="At least 6 characters"
                    className={inputClass}
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
                  <Label htmlFor="reg-confirm" className={labelClass}>Confirm Password</Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    placeholder="Repeat your password"
                    className={inputClass}
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

                <label
                  htmlFor="reg-newsletter"
                  className="flex items-start gap-3 rounded-2xl border border-border-primary bg-surface-secondary px-4 py-3 text-left"
                >
                  <input
                    id="reg-newsletter"
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 rounded border-border-primary text-accent focus:ring-accent"
                    {...registerForm.register("newsletterOptIn")}
                  />
                  <span className="text-xs leading-relaxed text-text-secondary">
                    Send me Nemuzoo newsletter and product updates. You can
                    unsubscribe at any time.
                  </span>
                </label>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  type="submit"
                  variant="warm"
                  size="md"
                  disabled={isLoading}
                  className={submitButtonClass}
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
