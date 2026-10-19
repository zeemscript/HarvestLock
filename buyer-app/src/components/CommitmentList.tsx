import type { CommitmentSummary } from "../api";
import { StatusBadge } from "./StatusBadge";
import { AddressChip } from "./AddressChip";

/**
 * Renders all three list states itself — in flight, failed, and
 * genuinely empty — rather than leaving the caller to decide whether to
 * mount it at all. Before this, `App.tsx` only mounted the component once
 * `listLoading` was false and `listError` was null, so the whole "What
 * you've locked" section rendered as a blank gap on first load (nothing
 * at all, not even "loading") and an error only showed as a banner in the
 * section above it. Keeping the states here makes each one reviewable in
 * isolation (see CommitmentList.stories.tsx and
 * CommitmentList.test.tsx) and keeps `App.tsx` from having to know which
 * one wins.
 */
export function CommitmentList({
  commitments,
  onSelect,
  loading = false,
  error = null,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
}: {
  commitments: CommitmentSummary[];
  onSelect: (contractId: string) => void;
  loading?: boolean;
  error?: string | null;
  /** Whether another page may exist. The API's list shape carries no
   * total, so the caller decides this (a full page means "maybe more"). */
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}) {
  if (loading) {
    return <div className="loading-state">Loading commitments…</div>;
  }

  if (error) {
    // `api.ts` throws `${path} -> ${status}: ${body}` — specific, not a
    // generic "something went wrong" (see api.ts's get/post).
    return <div className="error-banner">{error}</div>;
  }

  if (commitments.length === 0) {
    return (
      <div className="empty-state">
        Nothing locked yet. Look up a commitment by contract ID above, or check back once one's been created.
      </div>
    );
  }

  return (
    <div>
      <div className="commitment-list">
        {commitments.map((c) => (
          <button key={c.id} className="commitment-row" onClick={() => onSelect(c.contract_id)}>
            {/* copyable=false: this row is itself a <button> -- a nested
                <button> for the copy control would be invalid HTML. */}
            <AddressChip address={c.contract_id} copyable={false} className="contract-id" />
            <StatusBadge status={c.status} />
          </button>
        ))}
      </div>
      {hasMore && onLoadMore && (
        <button className="load-more-button" onClick={onLoadMore} disabled={loadingMore}>
          {loadingMore ? "Loading more…" : "Load more"}
        </button>
      )}
    </div>
  );
}
