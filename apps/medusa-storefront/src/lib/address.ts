export type CountryOption = {
  code: string;
  label: string;
  regionId: string;
  currencyCode: string;
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

export type StateOption = {
  code: string;
  label: string;
};

export const DEFAULT_COUNTRY_CODE = "us";

export const US_STATES: StateOption[] = [
  { code: "al", label: "Alabama" },
  { code: "ak", label: "Alaska" },
  { code: "az", label: "Arizona" },
  { code: "ar", label: "Arkansas" },
  { code: "ca", label: "California" },
  { code: "co", label: "Colorado" },
  { code: "ct", label: "Connecticut" },
  { code: "de", label: "Delaware" },
  { code: "fl", label: "Florida" },
  { code: "ga", label: "Georgia" },
  { code: "hi", label: "Hawaii" },
  { code: "id", label: "Idaho" },
  { code: "il", label: "Illinois" },
  { code: "in", label: "Indiana" },
  { code: "ia", label: "Iowa" },
  { code: "ks", label: "Kansas" },
  { code: "ky", label: "Kentucky" },
  { code: "la", label: "Louisiana" },
  { code: "me", label: "Maine" },
  { code: "md", label: "Maryland" },
  { code: "ma", label: "Massachusetts" },
  { code: "mi", label: "Michigan" },
  { code: "mn", label: "Minnesota" },
  { code: "ms", label: "Mississippi" },
  { code: "mo", label: "Missouri" },
  { code: "mt", label: "Montana" },
  { code: "ne", label: "Nebraska" },
  { code: "nv", label: "Nevada" },
  { code: "nh", label: "New Hampshire" },
  { code: "nj", label: "New Jersey" },
  { code: "nm", label: "New Mexico" },
  { code: "ny", label: "New York" },
  { code: "nc", label: "North Carolina" },
  { code: "nd", label: "North Dakota" },
  { code: "oh", label: "Ohio" },
  { code: "ok", label: "Oklahoma" },
  { code: "or", label: "Oregon" },
  { code: "pa", label: "Pennsylvania" },
  { code: "ri", label: "Rhode Island" },
  { code: "sc", label: "South Carolina" },
  { code: "sd", label: "South Dakota" },
  { code: "tn", label: "Tennessee" },
  { code: "tx", label: "Texas" },
  { code: "ut", label: "Utah" },
  { code: "vt", label: "Vermont" },
  { code: "va", label: "Virginia" },
  { code: "wa", label: "Washington" },
  { code: "wv", label: "West Virginia" },
  { code: "wi", label: "Wisconsin" },
  { code: "wy", label: "Wyoming" },
  { code: "dc", label: "District of Columbia" },
];

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

export function getStateOptions(countryCode: string): StateOption[] {
  return countryCode.toLowerCase() === "us" ? US_STATES : [];
}
