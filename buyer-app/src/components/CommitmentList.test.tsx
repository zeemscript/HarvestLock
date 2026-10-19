import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommitmentList } from "./CommitmentList";
import type { CommitmentSummary } from "../api";

const summary: CommitmentSummary = {
  id: "row-1",
  contract_id: "CDJGUBCZIDNNWXW2I5PQ6AIOTRR34ISWIZCUK2QDF5XURZANDAVJLMQY",
  buyer_address: "GBUYER",
  cooperative_address: "GCOOP",
  warehouse_address: "GWH",
  token_address: "CTOKEN",
  total_amount: "1000000000",
  advance1_bps: 1500,
  advance2_bps: 2000,
  claim_window_secs: "3600",
  status: "Locked",
  created_at: "2026-09-01T06:49:56.733Z",
  updated_at: "2026-09-01T06:50:23.319Z",
};

describe("CommitmentList", () => {
  it("renders a loading state while the list request is in flight", () => {
    render(<CommitmentList commitments={[]} loading onSelect={vi.fn()} />);

    expect(screen.getByText("Loading commitments…")).toBeInTheDocument();
    expect(screen.queryByText(/Nothing locked yet/)).not.toBeInTheDocument();
  });

  it("renders the specific request failure, not a generic message, when the list request fails", () => {
    const failure = '/commitments -> 500: {"statusCode":500,"message":"connection refused"}';
    render(<CommitmentList commitments={[]} error={failure} onSelect={vi.fn()} />);

    expect(screen.getByText(failure)).toBeInTheDocument();
    expect(screen.queryByText(/Nothing locked yet/)).not.toBeInTheDocument();
  });

  it("renders the empty state when the request succeeded and there is genuinely nothing yet", () => {
    render(<CommitmentList commitments={[]} onSelect={vi.fn()} />);

    expect(screen.getByText(/Nothing locked yet/)).toBeInTheDocument();
    expect(screen.queryByText("Loading commitments…")).not.toBeInTheDocument();
  });

  it("renders rows and reports the clicked contract ID", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<CommitmentList commitments={[summary]} onSelect={onSelect} />);

    await user.click(screen.getByTitle(summary.contract_id));

    expect(onSelect).toHaveBeenCalledWith(summary.contract_id);
    expect(screen.getByText("Locked")).toBeInTheDocument();
  });

  it("offers 'Load more' only while the caller says another page may exist, and asks for it on click", async () => {
    const onLoadMore = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <CommitmentList commitments={[summary]} onSelect={vi.fn()} hasMore onLoadMore={onLoadMore} />,
    );

    const button = screen.getByRole("button", { name: "Load more" });
    await user.click(button);
    expect(onLoadMore).toHaveBeenCalledTimes(1);

    // Short page / exhausted: the caller flips hasMore off and the
    // control disappears rather than offering an empty next fetch.
    rerender(<CommitmentList commitments={[summary]} onSelect={vi.fn()} hasMore={false} onLoadMore={onLoadMore} />);
    expect(screen.queryByRole("button", { name: "Load more" })).not.toBeInTheDocument();
  });

  it("disables 'Load more' and says so while the next page is in flight", () => {
    render(
      <CommitmentList
        commitments={[summary]}
        onSelect={vi.fn()}
        hasMore
        loadingMore
        onLoadMore={vi.fn()}
      />,
    );

    const button = screen.getByRole("button", { name: "Loading more…" });
    expect(button).toBeDisabled();
  });
});
