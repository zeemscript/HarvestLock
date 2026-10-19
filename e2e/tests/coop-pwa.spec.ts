import { test, expect } from "@playwright/test";
import { LIVE, SKIP_REASON, buyerKeypair, cooperativeKeypair, warehouseKeypair } from "./helpers/env";
import { connectInjectedWallet } from "./helpers/freighter";
import { deployAndInitialize, ensureFunded, getCommitment, submitMethod } from "./helpers/api";

/**
 * Issue #199: one real end-to-end smoke test for coop-pwa. Unlike this
 * app's own vitest suite (fetch and wallet fully mocked), this drives a
 * real browser against a real API and real testnet: the cooperative
 * claims advance tranche 1 through the actual UI, signed by a throwaway
 * testnet keypair injected in place of a Freighter extension.
 *
 * Claiming needs a commitment that's already Locked with advance 1
 * released — state no single-app UI can reach on its own — so the test
 * sets that up first through the same real HTTP routes and testnet
 * transactions, driven from Node (helpers/api.ts). That setup is real,
 * not mocked: the browser then reads it back live and the claim itself
 * is the only step under test.
 */
test.skip(!LIVE, SKIP_REASON);

test("claims advance tranche 1 end to end through the real API and testnet", async ({ page }) => {
  const buyer = buyerKeypair();
  const cooperative = cooperativeKeypair();
  const warehouse = warehouseKeypair();

  // All three parties' accounts must really exist: `lock` needs the
  // buyer funded (it escrows real testnet XLM), `release_advance_1`
  // needs the warehouse operator's account for its auth check, and the
  // cooperative's own signature on the claim reads their account too.
  await Promise.all([
    ensureFunded(buyer.publicKey()),
    ensureFunded(cooperative.publicKey()),
    ensureFunded(warehouse.publicKey()),
  ]);

  const contractId = await deployAndInitialize({ buyer, cooperative, warehouse });
  await submitMethod(contractId, "lock", buyer);
  await submitMethod(contractId, "release_advance_1", warehouse);

  await connectInjectedWallet(page, cooperative);
  await page.goto("/");

  await page.getByRole("button", { name: "Connect wallet" }).click();
  await expect(page.locator(".wallet-address")).toContainText(cooperative.publicKey().slice(0, 4));

  await page.locator("#contract-lookup").fill(contractId);
  await page.getByRole("button", { name: "Look up" }).click();

  const advance1Row = page.locator(".tranches tbody tr").first();
  await expect(advance1Row).toContainText("pending", { timeout: 120_000 });
  await advance1Row.getByRole("button", { name: "Claim", exact: true }).click();

  // UI read-back: the state cell flips to "claimed" once the app re-reads
  // the commitment from chain after its submit.
  await expect(advance1Row.getByText("claimed")).toBeVisible({ timeout: 120_000 });

  // Chain truth, independent of the UI.
  const commitment = await getCommitment(contractId);
  expect(commitment.advance1_claimed).toBe(true);
  expect(commitment.advance1_expired).toBe(false);
});
