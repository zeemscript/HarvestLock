import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { AddressChip } from "./AddressChip";

// Deliberately duplicated verbatim across buyer-app, coop-pwa and
// warehouse-app, like the component itself (documented convention — see
// docs/audits/2026-10-18-addresschip-statusbadge-drift-audit.md). These
// pin the truncation/copy/title contract so an edit to one app's copy
// can't silently diverge from the others.
const ADDRESS = "GBUYERADDRESSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

function stubClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
}

describe("AddressChip", () => {
  it("truncates to first four + last four and keeps the full address in the title", () => {
    render(<AddressChip address={ADDRESS} />);
    const chip = screen.getByTitle(ADDRESS);
    expect(chip).toHaveTextContent(`${ADDRESS.slice(0, 4)}…${ADDRESS.slice(-4)}`);
    expect(chip).toHaveAttribute("title", ADDRESS);
  });

  it("copies the full address, not the truncated text, and flips the label back after 1.5s", async () => {
    vi.useFakeTimers();
    try {
      const writeText = vi.fn().mockResolvedValue(undefined);
      stubClipboard(writeText);
      render(<AddressChip address={ADDRESS} />);
      fireEvent.click(screen.getByRole("button", { name: "Copy" }));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(writeText).toHaveBeenCalledWith(ADDRESS);
      expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1500);
      });
      expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("hides the copy button when copyable is false (the nested-<button> case)", () => {
    render(<AddressChip address={ADDRESS} copyable={false} />);
    expect(screen.getByTitle(ADDRESS)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("stops propagation on copy clicks so a clickable row isn't triggered, but still bubbles from the chip itself", () => {
    stubClipboard(vi.fn().mockResolvedValue(undefined));
    const onRowClick = vi.fn();
    render(
      <div onClick={onRowClick}>
        <AddressChip address={ADDRESS} />
      </div>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(onRowClick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTitle(ADDRESS));
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  it("does not flip to Copied when clipboard access is denied", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    stubClipboard(writeText);
    render(<AddressChip address={ADDRESS} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(ADDRESS));
    expect(screen.queryByRole("button", { name: "Copied" })).not.toBeInTheDocument();
  });
});
