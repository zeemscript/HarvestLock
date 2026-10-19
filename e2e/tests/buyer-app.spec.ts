import { test, expect } from "@playwright/test";
import { Keypair } from "@stellar/stellar-sdk";
import { API_URL, LIVE, NATIVE_TOKEN_CONTRACT, SKIP_REASON, buyerKeypair } from "./helpers/env";
import { connectInjectedWallet } from "./helpers/freighter";
import { ensureFunded, getCommitment } from "./helpers/api";

/**
 * Issue #198: one real end-to-end smoke test for buyer-app. Unlike this
 * app's own vitest suite (fetch and wallet fully mocked), this drives a
 * real browser against a real API and real testnet: the create-commitment
 * form's deploy → build initialize → sign → submit → read-back walk
 * happens exactly as a real buyer would run it, with a throwaway testnet
 * keypair injected in place of a Freighter extension. It exists to catch
 * the class of integration break the mocked suites structurally can't —
 * a CORS regression, an API route/shape drift, an SDK signing mismatch.
 *
 * The one thing this test does differently from a real buyer is the
 * wallet: no Freighter extension exists in this environment (a
 * long-documented limitation of this project), so the postMessage
 * channel Freighter uses is stubbed and backed by the test's own
 * throwaway keypair — see helpers/freighter.ts.
 */
test.skip(!LIVE, SKIP_REASON);

test("creates a commitment end to end through the real API and testnet", async ({ page }) => {
  // Only the buyer needs a real, funded account here: they're the only
  // party whose signature this flow requires (`initialize` is
  // buyer-signed). The other two are plain addresses the contract stores.
  const buyer = buyerKeypair();
  const cooperative = Keypair.random();
  const warehouse = Keypair.random();
  await ensureFunded(buyer.publicKey());

  await connectInjectedWallet(page, buyer);
  await page.goto("/");

  await page.getByRole("button", { name: "Connect wallet" }).click();
  await expect(page.locator(".wallet-address")).toContainText(buyer.publicKey().slice(0, 4));

  await page.getByRole("button", { name: "Create commitment" }).click();
  await page.getByLabel("Cooperative address").fill(cooperative.publicKey());
  await page.getByLabel("Warehouse operator address").fill(warehouse.publicKey());
  await page.getByLabel("Token contract address").fill(NATIVE_TOKEN_CONTRACT);
  await page.getByLabel("Total amount (stroops)").fill("1000000000");
  await page.getByLabel("Advance 1 share (basis points)").fill("1500");
  await page.getByLabel("Advance 2 share (basis points)").fill("2000");
  await page.getByLabel("Claim window (seconds)").fill("3600");
  await page.getByLabel("Remainder-payment window (seconds)").fill("3600");
  await page.getByLabel("Delivery window (seconds)").fill("86400");
  await page.getByLabel("Contracted quantity").fill("1000");
  await page.getByLabel("Grade price schedule").fill("10000,9000,7500");
  await page.getByLabel(/Roles & Responsibilities/).check();

  // Grab the freshly deployed contract's ID from the API's own response
  // (the UI only renders it truncated, with the full value in a title).
  const deployResponse = page.waitForResponse(
    (res) => res.url() === `${API_URL}/commitments/deploy` && res.request().method() === "POST",
  );
  await page.locator("form.create-commitment-form button[type=submit]").click();
  const { contractId } = (await (await deployResponse).json()) as { contractId: string };
  expect(contractId).toMatch(/^C[A-Z2-7]{55}$/);

  // The UI read-back: detail view opens on the new commitment, showing
  // its real on-chain status (read live from testnet through the API).
  await expect(page.locator(".detail-header .badge")).toHaveText("Draft", { timeout: 120_000 });
  await expect(page.locator(".detail-header .contract-id")).toHaveAttribute("title", contractId);

  // The chain truth, read independently of the UI: every field the form
  // submitted genuinely landed on the contract.
  const commitment = await getCommitment(contractId);
  expect(commitment.status).toBe("Draft");
  expect(commitment.buyer).toBe(buyer.publicKey());
  expect(commitment.cooperative).toBe(cooperative.publicKey());
  expect(commitment.warehouse_operator).toBe(warehouse.publicKey());
  expect(commitment.token).toBe(NATIVE_TOKEN_CONTRACT);
  expect(commitment.total_amount).toBe("1000000000");
  expect(commitment.contracted_quantity).toBe(1000);
  expect(commitment.grade_price_bps).toEqual([10_000, 9_000, 7_500]);
});
