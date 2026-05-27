"use client";

import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  type CheckoutMode,
  useCheckoutStore,
} from "@/lib/checkout/store";

type LoginValues = {
  email: string;
  password: string;
};

type CheckoutIdentityStepProps = {
  isAuthenticated: boolean;
  customerEmail?: string;
  onLoginSuccess: () => void;
};

export default function CheckoutIdentityStep({
  isAuthenticated,
  customerEmail,
  onLoginSuccess,
}: CheckoutIdentityStepProps) {
  const mode = useCheckoutStore((s) => s.mode);
  const setMode = useCheckoutStore((s) => s.setMode);
  const loginAndTransferCart = useCheckoutStore((s) => s.loginAndTransferCart);
  const isLoggingIn = useCheckoutStore((s) => s.isLoggingIn);
  const loginError = useCheckoutStore((s) => s.loginError);
  const { register, handleSubmit } = useForm<LoginValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(values: LoginValues) {
    const didLogin = await loginAndTransferCart(values);

    if (didLogin) {
      onLoginSuccess();
    }
  }

  if (isAuthenticated) {
    return (
      <section className="space-y-2 rounded-lg border border-border-primary p-4 text-sm">
        <h2 className="font-heading text-xl font-semibold text-text-primary">
          Account
        </h2>
        <p className="text-text-secondary">
          Checking out as {customerEmail}.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-xl font-semibold text-text-primary">
        Checkout Options
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <IdentityButton
          mode="login"
          selectedMode={mode}
          title="Sign in and checkout"
          description="Use your saved customer details."
          onClick={() => setMode("login")}
        />
        <IdentityButton
          mode="guest"
          selectedMode={mode}
          title="Checkout as guest"
          description="Place this order without creating an account."
          onClick={() => setMode("guest")}
        />
      </div>

      {mode === "login" && (
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="space-y-4 rounded-lg border border-border-primary p-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="checkout-login-email">Email</Label>
              <Input
                id="checkout-login-email"
                type="email"
                {...register("email", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-login-password">Password</Label>
              <Input
                id="checkout-login-password"
                type="password"
                {...register("password", { required: true })}
              />
            </div>
          </div>
          <Button type="submit" variant="accent" disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                <Spinner data-icon="inline-start" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
          {loginError && <p className="text-sm text-error">{loginError}</p>}
        </form>
      )}
    </section>
  );
}

function IdentityButton({
  mode,
  selectedMode,
  title,
  description,
  onClick,
}: {
  mode: CheckoutMode;
  selectedMode: CheckoutMode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-4 text-left text-sm transition-colors ${
        selectedMode === mode
          ? "border-accent bg-accent/10"
          : "border-border-primary"
      }`}
    >
      <span className="block font-medium text-text-primary">{title}</span>
      <span className="mt-1 block text-text-secondary">{description}</span>
    </button>
  );
}
