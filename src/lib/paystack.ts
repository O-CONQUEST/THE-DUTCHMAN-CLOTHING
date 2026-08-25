const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error(
      "Payments aren't configured yet. Add PAYSTACK_SECRET_KEY to your environment variables."
    );
  }
  return key;
}

type InitializeParams = {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

type InitializeResult = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export async function initializePaystackTransaction(
  params: InitializeParams
): Promise<InitializeResult> {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data.message || "Failed to initialize payment.");
  }
  return data.data as InitializeResult;
}

type VerifyResult = {
  status: string;
  amount: number;
  reference: string;
  metadata?: Record<string, unknown>;
};

export async function verifyPaystackTransaction(reference: string): Promise<VerifyResult> {
  const res = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${getSecretKey()}` } }
  );

  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data.message || "Failed to verify payment.");
  }
  return data.data as VerifyResult;
}
