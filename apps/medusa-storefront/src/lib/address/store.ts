import { create } from "zustand";

import {
  addressFormToPayload,
  buildCountryOptions,
  type AddressFormValues,
  type AddressKind,
  type CountryOption,
  type CustomerAddress,
  type RegionWithCountries,
} from "@/lib/address";
import medusaClient from "@/lib/medusa-client";
import type { Customer } from "@/types";

const customerAddressFields =
  "id,address_name,is_default_shipping,is_default_billing,first_name,last_name,address_1,address_2,city,province,postal_code,country_code,phone";

interface AddressState {
  countries: CountryOption[];
  customerAddresses: CustomerAddress[];
  isLoadingCountries: boolean;
  isLoadingAddresses: boolean;
  error: string | null;

  loadCountries: () => Promise<CountryOption[]>;
  loadCustomerAddresses: () => Promise<CustomerAddress[]>;
  saveCustomerAddress: (
    kind: AddressKind,
    values: AddressFormValues,
    addressId?: string
  ) => Promise<CustomerAddress | null>;
  syncCheckoutAddress: (
    values: AddressFormValues,
    customer?: Customer | null,
    addressId?: string
  ) => Promise<void>;
  clearError: () => void;
}

function findDefaultAddress(
  addresses: CustomerAddress[],
  kind: AddressKind
): CustomerAddress | undefined {
  return addresses.find((address) =>
    kind === "shipping"
      ? address.is_default_shipping
      : address.is_default_billing
  );
}

export const useAddressStore = create<AddressState>((set, get) => ({
  countries: [],
  customerAddresses: [],
  isLoadingCountries: false,
  isLoadingAddresses: false,
  error: null,

  loadCountries: async () => {
    set({ isLoadingCountries: true, error: null });

    try {
      const { regions } = await medusaClient.store.region.list({
        fields: "id,currency_code,*countries",
      });
      const countries = buildCountryOptions(regions as RegionWithCountries[]);

      set({ countries, isLoadingCountries: false });
      return countries;
    } catch (e) {
      set({
        isLoadingCountries: false,
        error:
          e instanceof Error
            ? e.message
            : "Could not load available countries.",
      });
      return [];
    }
  },

  loadCustomerAddresses: async () => {
    set({ isLoadingAddresses: true, error: null });

    try {
      const { addresses } = await medusaClient.store.customer.listAddress({
        fields: customerAddressFields,
      });
      const customerAddresses = (addresses || []) as CustomerAddress[];

      set({ customerAddresses, isLoadingAddresses: false });
      return customerAddresses;
    } catch (e) {
      set({
        customerAddresses: [],
        isLoadingAddresses: false,
        error:
          e instanceof Error ? e.message : "Could not load your saved addresses.",
      });
      return [];
    }
  },

  saveCustomerAddress: async (
    kind: AddressKind,
    values: AddressFormValues,
    addressId?: string
  ) => {
    const payload = addressFormToPayload(values, kind);

    if (addressId) {
      const { customer } = await medusaClient.store.customer.updateAddress(
        addressId,
        payload
      );
      const customerAddresses = (customer.addresses || []) as CustomerAddress[];
      const savedAddress =
        customerAddresses.find((address) => address.id === addressId) ||
        findDefaultAddress(customerAddresses, kind) ||
        null;

      set({ customerAddresses });
      return savedAddress;
    }

    const { customer } = await medusaClient.store.customer.createAddress(
      payload
    );
    const customerAddresses = (customer.addresses || []) as CustomerAddress[];
    const savedAddress = findDefaultAddress(customerAddresses, kind) || null;

    set({ customerAddresses });
    return savedAddress;
  },

  syncCheckoutAddress: async (
    values: AddressFormValues,
    customer?: Customer | null,
    addressId?: string
  ) => {
    const { customerAddresses, saveCustomerAddress } = get();
    const currentAddress = addressId
      ? customerAddresses.find((address) => address.id === addressId)
      : undefined;

    await medusaClient.store.customer.update({
      first_name: values.firstName,
      last_name: values.lastName,
      phone: values.phone || undefined,
    });

    await saveCustomerAddress(
      "shipping",
      {
        ...values,
        firstName: values.firstName || customer?.first_name || "",
        lastName: values.lastName || customer?.last_name || "",
      },
      currentAddress?.id
    );

    const { customerAddresses: latestAddresses } = get();
    const savedAddress =
      latestAddresses.find((address) => address.id === currentAddress?.id) ||
      findDefaultAddress(latestAddresses, "shipping");

    if (savedAddress?.id) {
      await medusaClient.store.customer.updateAddress(savedAddress.id, {
        is_default_billing: true,
      });
      await get().loadCustomerAddresses();
    }
  },

  clearError: () => set({ error: null }),
}));
