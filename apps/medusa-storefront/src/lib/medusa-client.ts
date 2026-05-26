import Medusa from "@medusajs/medusa-js";

const medusaClient = new Medusa({
  baseUrl: "",
  maxRetries: 2,
  publishableApiKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY,
});

export default medusaClient;
