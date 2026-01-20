import crypto from "crypto";

export async function createAddress({ reference }: { reference?: string } = {}) {
  // For mock testing we either use configured test address or generate a pseudo address
  const configured = process.env.USDT_WALLET_ADDRESS;
  const address = configured || generateMockTronAddress();
  const providerAddressId = "prov_" + crypto.randomBytes(6).toString("hex");
  return { address, providerAddressId };
}

export async function getTransaction(txHash: string) {
  // In a mock provider this can be a no-op or return null. Real provider
  // integration will query Tatum or TronGrid for transaction details.
  return null;
}

function generateMockTronAddress() {
  // Not a real base58 Tron address; adequate for local testing only.
  return "T" + crypto.randomBytes(20).toString("hex").slice(0, 33);
}
