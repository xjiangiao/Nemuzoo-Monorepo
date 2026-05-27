import { State } from "country-state-city";

export type AddressKind = "shipping" | "billing";

export type CountryOption = {
  code: string;
  label: string;
  regionId: string;
  currencyCode: string;
};

export type ProvinceOption = {
  code: string;
  label: string;
};

export type RegionCountry = {
  iso_2?: string | null;
  code?: string | null;
  display_name?: string | null;
  name?: string | null;
};

export type RegionWithCountries = {
  id: string;
  currency_code: string;
  countries?: RegionCountry[];
};

export type CustomerAddress = {
  id?: string;
  address_name?: string | null;
  is_default_shipping?: boolean;
  is_default_billing?: boolean;
  first_name?: string | null;
  last_name?: string | null;
  address_1?: string | null;
  address_2?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  country_code?: string | null;
  phone?: string | null;
};

export type AddressFormValues = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  postalCode: string;
  countryCode: string;
  phone: string;
};

export type SavedAddressFormValues = AddressFormValues & {
  id: string;
};

export const DEFAULT_COUNTRY_CODE = "us";

export const emptyAddressValues: AddressFormValues = {
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  province: "",
  postalCode: "",
  countryCode: DEFAULT_COUNTRY_CODE,
  phone: "",
};

export const emptySavedAddressValues: SavedAddressFormValues = {
  id: "",
  ...emptyAddressValues,
};

function getCountryCode(country: RegionCountry) {
  return (country.iso_2 || country.code || "").toLowerCase();
}

function getCountryLabel(country: RegionCountry) {
  const code = getCountryCode(country);

  if (country.display_name || country.name) {
    return country.display_name || country.name || code.toUpperCase();
  }

  try {
    const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
    return displayNames.of(code.toUpperCase()) || code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

export function buildCountryOptions(
  regions: RegionWithCountries[]
): CountryOption[] {
  const countries = regions.flatMap((region) =>
    (region.countries || [])
      .map((country) => {
        const code = getCountryCode(country);

        if (!code) return null;

        return {
          code,
          label: getCountryLabel(country),
          regionId: region.id,
          currencyCode: region.currency_code,
        };
      })
      .filter(Boolean)
  ) as CountryOption[];

  return countries.sort((a, b) => {
    if (a.code === DEFAULT_COUNTRY_CODE) return -1;
    if (b.code === DEFAULT_COUNTRY_CODE) return 1;
    return a.label.localeCompare(b.label);
  });
}

export function getProvinceOptions(countryCode: string): ProvinceOption[] {
  if (!countryCode) return [];

  return State.getStatesOfCountry(countryCode.toUpperCase()).map((state) => ({
    code: state.isoCode.toLowerCase(),
    label: state.name,
  }));
}

export function normalizeProvince(value?: string | null) {
  return value?.toLowerCase() || "";
}

export function addressToFormValues(
  address?: CustomerAddress | null,
  fallback: Partial<Pick<AddressFormValues, "firstName" | "lastName">> = {}
): AddressFormValues {
  return {
    ...emptyAddressValues,
    firstName: address?.first_name || fallback.firstName || "",
    lastName: address?.last_name || fallback.lastName || "",
    address1: address?.address_1 || "",
    address2: address?.address_2 || "",
    city: address?.city || "",
    province: normalizeProvince(address?.province),
    postalCode: address?.postal_code || "",
    countryCode: (address?.country_code || DEFAULT_COUNTRY_CODE).toLowerCase(),
    phone: address?.phone || "",
  };
}

export function savedAddressToFormValues(
  address?: CustomerAddress | null,
  fallback: Partial<Pick<AddressFormValues, "firstName" | "lastName">> = {}
): SavedAddressFormValues {
  return {
    id: address?.id || "",
    ...addressToFormValues(address, fallback),
  };
}

export function addressFormToPayload(
  values: AddressFormValues,
  kind?: AddressKind
) {
  return {
    first_name: values.firstName,
    last_name: values.lastName,
    phone: values.phone || null,
    address_1: values.address1,
    address_2: values.address2 || null,
    city: values.city,
    province: values.province || null,
    postal_code: values.postalCode,
    country_code: values.countryCode.toLowerCase(),
    ...(kind
      ? {
          address_name:
            kind === "shipping" ? "Shipping address" : "Billing address",
          ...(kind === "shipping" ? { is_default_shipping: true } : {}),
          ...(kind === "billing" ? { is_default_billing: true } : {}),
        }
      : {}),
  };
}

export function validateAddressValues(values: AddressFormValues) {
  if (!values.firstName.trim() || !values.lastName.trim()) {
    return "Enter first and last name.";
  }

  if (
    !values.address1.trim() ||
    !values.city.trim() ||
    !values.postalCode.trim()
  ) {
    return "Enter a complete address.";
  }

  if (getProvinceOptions(values.countryCode).length && !values.province.trim()) {
    return "Select a state or province.";
  }

  return null;
}
