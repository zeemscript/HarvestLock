import type { CommitmentSummary } from "../api";
import { StatusBadge } from "./StatusBadge";
import { AddressChip } from "./AddressChip";

export function CommitmentList({
  commitments,
  onSelect,
  hasMore = false,
  loadingMore = false,
  loadMoreError = null,
  onLoadMore,
}: {
  commitments: CommitmentSummary[];
  onSelect: (contractId: string) => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  loadMoreError?: string | null;
  onLoadMore?: () => void;
}) {
  if (commitments.length === 0) {
    return (
      <div className="empty-state">
        No commitments cached yet. Look one up by contract ID above, or check back once one's been created.
      </div>
    );
  }

  return (
    <div className="commitment-list">
      {commitments.map((c) => (
        <button key={c.id} className="commitment-row" onClick={() => onSelect(c.contract_id)}>
          {/* copyable=false: this row is itself a <button> -- a nested
              <button> for the copy control would be invalid HTML. */}
          <AddressChip address={c.contract_id} copyable={false} className="contract-id" />
          <StatusBadge status={c.status} />
        </button>
      ))}
      {loadMoreError && <div className="error-banner" role="alert">{loadMoreError}</div>}
      {hasMore && onLoadMore && (
        <button className="refresh-button" onClick={onLoadMore} disabled={loadingMore}>
          {loadingMore ? "Loading more…" : "Load more"}
        </button>
      )}
    </div>
  );
}
