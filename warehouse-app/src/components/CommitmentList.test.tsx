import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CommitmentList } from "./CommitmentList";

describe("CommitmentList", () => {
  it("renders a helpful message when there are no commitments", () => {
    render(<CommitmentList commitments={[]} onSelect={vi.fn()} />);

    expect(
      screen.getByText(
        "Nothing to attest yet. Look up a commitment by contract ID above, or check back once one's been created.",
      ),
    ).toBeInTheDocument();
  });
});