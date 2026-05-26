"use client";

import { ReactNode, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  emptyAddressValues,
  getProvinceOptions,
  type AddressFormValues,
  type CountryOption,
} from "@/lib/address";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-text-primary transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:disabled:bg-input/80";

type AddressFormProps = {
  id?: string;
  title?: string;
  countries: CountryOption[];
  defaultValues?: AddressFormValues;
  submitLabel: string;
  submittingLabel?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
  fieldsDisabled?: boolean;
  auxiliaryAction?: ReactNode;
  footer?: ReactNode;
  onCountryChange?: (countryCode: string) => void | Promise<void>;
  onSubmit: (values: AddressFormValues) => void | Promise<void>;
};

export default function AddressForm({
  id,
  title,
  countries,
  defaultValues = emptyAddressValues,
  submitLabel,
  submittingLabel = "Saving...",
  isSubmitting,
  disabled,
  fieldsDisabled,
  auxiliaryAction,
  footer,
  onCountryChange,
  onSubmit,
}: AddressFormProps) {
  const {
    register,
    reset,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    defaultValues,
  });
  const countryCode = useWatch({ control, name: "countryCode" });
  const provinceOptions = getProvinceOptions(countryCode);
  const hasProvinceOptions = provinceOptions.length > 0;
  const areFieldsDisabled = fieldsDisabled ?? disabled;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  async function handleCountryChange(countryCode: string) {
    setValue("countryCode", countryCode, { shouldDirty: true });
    setValue("province", "", { shouldDirty: true });
    await onCountryChange?.(countryCode);
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border border-border-primary bg-surface-elevated p-6"
    >
      {(title || auxiliaryAction) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          {title && (
            <h2 className="font-heading text-xl font-semibold text-text-primary">
              {title}
            </h2>
          )}
          {auxiliaryAction}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${id || "address"}-first-name`}>First Name</Label>
          <Input
            id={`${id || "address"}-first-name`}
            disabled={areFieldsDisabled}
            aria-invalid={!!errors.firstName}
            {...register("firstName", { required: "Enter first name." })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id || "address"}-last-name`}>Last Name</Label>
          <Input
            id={`${id || "address"}-last-name`}
            disabled={areFieldsDisabled}
            aria-invalid={!!errors.lastName}
            {...register("lastName", { required: "Enter last name." })}
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor={`${id || "address"}-address-1`}>Address</Label>
        <Input
          id={`${id || "address"}-address-1`}
          disabled={areFieldsDisabled}
          aria-invalid={!!errors.address1}
          {...register("address1", { required: "Enter an address." })}
        />
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor={`${id || "address"}-address-2`}>
          Apartment, Suite, etc.
        </Label>
        <Input
          id={`${id || "address"}-address-2`}
          disabled={areFieldsDisabled}
          {...register("address2")}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor={`${id || "address"}-city`}>City</Label>
          <Input
            id={`${id || "address"}-city`}
            disabled={areFieldsDisabled}
            aria-invalid={!!errors.city}
            {...register("city", { required: "Enter a city." })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id || "address"}-province`}>
            {hasProvinceOptions ? "State / Province" : "State / Province"}
          </Label>
          {hasProvinceOptions ? (
            <select
              id={`${id || "address"}-province`}
              className={selectClassName}
              disabled={areFieldsDisabled}
              aria-invalid={!!errors.province}
              {...register("province", {
                required: "Select a state or province.",
              })}
            >
              <option value="">Select state</option>
              {provinceOptions.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.label}
                </option>
              ))}
            </select>
          ) : (
            <Input
              id={`${id || "address"}-province`}
              disabled={areFieldsDisabled}
              {...register("province")}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id || "address"}-postal-code`}>
            {countryCode === "us" ? "ZIP Code" : "Postal Code"}
          </Label>
          <Input
            id={`${id || "address"}-postal-code`}
            disabled={areFieldsDisabled}
            aria-invalid={!!errors.postalCode}
            {...register("postalCode", { required: "Enter a postal code." })}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${id || "address"}-country`}>Country</Label>
          <select
            id={`${id || "address"}-country`}
            className={selectClassName}
            disabled={areFieldsDisabled || !countries.length}
            {...register("countryCode", {
              required: "Choose a country.",
              onChange: (event) => void handleCountryChange(event.target.value),
            })}
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id || "address"}-phone`}>Phone</Label>
          <Input
            id={`${id || "address"}-phone`}
            type="tel"
            disabled={areFieldsDisabled}
            {...register("phone")}
          />
        </div>
      </div>

      {(errors.firstName ||
        errors.lastName ||
        errors.address1 ||
        errors.city ||
        errors.province ||
        errors.postalCode) && (
        <p className="mt-4 text-sm text-error">
          {errors.firstName?.message ||
            errors.lastName?.message ||
            errors.address1?.message ||
            errors.city?.message ||
            errors.province?.message ||
            errors.postalCode?.message}
        </p>
      )}

      {footer}

      <Button
        type="submit"
        variant="accent"
        className="mt-5"
        disabled={disabled || isSubmitting || !countries.length}
      >
        {isSubmitting ? (
          <>
            <Spinner data-icon="inline-start" />
            {submittingLabel}
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
