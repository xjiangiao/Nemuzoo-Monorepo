import Medusa from "@medusajs/js-sdk";

const medusaClient = new Medusa({
  baseUrl: "",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY,
  auth: {
    type: "session",
    fetchCredentials: "include",
  },
});

export default medusaClient;
