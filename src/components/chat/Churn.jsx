import { useState } from "react";
import { RefreshCw, Search, X } from "lucide-react";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import { SkeletonBlock } from "../components/ui/Skeleton.jsx";
import { EmptyState, ErrorState } from "../components/ui/States.jsx";
import { useApiQuery } from "../hooks/useApiQuery.js";
import { api } from "../lib/api.js";
import { formatCurrency, formatNumber } from "../lib/format.js";

const BUCKET_TONES = {
  Low: "positive",
  Medium: "neutral",
  High: "caution",
  "Very High": "danger",
};

const BUCKET_FILTERS = ["Very High", "High", "Medium", "Low"];

function RiskRow({ customer, onRecompute, freshScore, isRecomputing, note }) {
  const displayed = freshScore ?? customer.churn_proba;
  const displayedBucket = freshScore
    ? freshScore >= 0.75
      ? "Very High"
      : freshScore >= 0.5
        ? "High"
        : freshScore >= 0.25
          ? "Medium"
          : "Low"
    : customer.risk_bucket;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{customer.name}</p>
        <p className="numeric text-[11px] text-ink-faint">
          {customer.customer_code || customer.customer_id} · {customer.segment}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-right">
          <span className="numeric block text-lg font-semibold text-ink">
            {(displayed * 100).toFixed(1)}%
          </span>
          <span className="text-[10px] uppercase tracking-wider text-ink-faint">
            risiko churn
          </span>
        </span>
        <Badge tone={BUCKET_TONES[displayedBucket]}>{displayedBucket}</Badge>
        <Badge tone="neutral">{customer.track}</Badge>
        <span className="numeric hidden text-xs text-ink-soft sm:block">
          {formatCurrency(customer.monetary_total)}
        </span>
        {customer.total_trips === 0 ? (
          <Badge tone="neutral">belum pernah booking</Badge>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            icon={RefreshCw}
            disabled={isRecomputing}
            onClick={() => onRecompute(customer.customer_id)}
          >
            {isRecomputing ? "menghitung…" : freshScore ? "segar" : "hitung ulang"}
          </Button>
        )}
      </div>

      {note ? (
        <p className="w-full text-xs text-caution">{note}</p>
      ) : null}
    </div>
  );
}

export default function Churn() {
  const [bucket, setBucket] = useState("Very High");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [freshScores, setFreshScores] = useState({});
  const [rowNotes, setRowNotes] = useState({});
  const [recomputingId, setRecomputingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const riskList = useApiQuery("/customers/churn-risk", { bucket, limit: 25 });
  const searchResults = useApiQuery(
    "/customers/search",
    { q: activeSearch, limit: 10 },
    { enabled: activeSearch.length >= 2 }
  );

  async function recompute(customerId) {
    setRecomputingId(customerId);
    setActionError(null);
    setRowNotes((previous) => ({ ...previous, [customerId]: null }));
    try {
      const response = await api.post("/predict/churn", {
        customer_ids: [customerId],
      });
      const prediction = response.predictions?.[0];
      if (prediction) {
        setFreshScores((previous) => ({
          ...previous,
          [customerId]: prediction.churn_proba,
        }));
      } else {
        setRowNotes((previous) => ({
          ...previous,
          [customerId]: "Belum ada riwayat booking valid untuk di-skor.",
        }));
      }
    } catch (caught) {
      if (caught.status === 404) {
        setRowNotes((previous) => ({
          ...previous,
          [customerId]:
            "Pelanggan ini belum punya booking berstatus selesai atau terkonfirmasi, jadi model tidak bisa menghitung risikonya.",
        }));
      } else {
        setActionError(caught.message);
      }
    } finally {
      setRecomputingId(null);
    }
  }

  const searchRows = searchResults.data || [];

  return (
    <div className="space-y-5">
      <Card
        title="Cari pelanggan"
        subtitle="Ketik nama atau kode pelanggan, lalu hitung risikonya"
      >
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            setActiveSearch(searchTerm.trim());
          }}
        >
          <label className="sr-only" htmlFor="customer-search">
            Nama atau kode pelanggan
          </label>
          <input
            id="customer-search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Contoh: Cornelia atau CUST-000123"
            className="flex-1 rounded-lg border border-hairline bg-canvas px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <Button type="submit" icon={Search}>
            Cari
          </Button>
          {activeSearch ? (
            <Button
              type="button"
              variant="ghost"
              icon={X}
              onClick={() => {
                setSearchTerm("");
                setActiveSearch("");
              }}
            >
              Bersihkan
            </Button>
          ) : null}
        </form>

        {activeSearch ? (
          <div className="mt-4 space-y-2">
            {searchResults.isLoading ? (
              <SkeletonBlock rows={3} />
            ) : searchResults.error ? (
              <ErrorState message={searchResults.error.message} />
            ) : searchRows.length === 0 ? (
              <EmptyState
                title="Tidak ditemukan"
                hint="Coba potongan nama yang lebih pendek."
              />
            ) : (
              searchRows.map((customer) => (
                <RiskRow
                  key={customer.customer_id}
                  customer={{ ...customer, churn_proba: 0, risk_bucket: "Low", track: "—" }}
                  freshScore={freshScores[customer.customer_id]}
                  note={rowNotes[customer.customer_id]}
                  isRecomputing={recomputingId === customer.customer_id}
                  onRecompute={recompute}
                />
              ))
            )}
          </div>
        ) : null}
      </Card>

      <Card
        title="Pelanggan paling berisiko"
        subtitle="Diurutkan dari probabilitas tertinggi, lalu nilai belanja"
        actions={
          <div className="flex flex-wrap gap-1">
            {BUCKET_FILTERS.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={bucket === item ? "primary" : "ghost"}
                onClick={() => setBucket(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        }
      >
        {riskList.isLoading ? (
          <SkeletonBlock rows={6} />
        ) : riskList.error ? (
          <ErrorState message={riskList.error.message} onRetry={riskList.refetch} />
        ) : (riskList.data || []).length === 0 ? (
          <EmptyState
            title="Belum ada skor churn"
            hint="Jalankan `python -m jobs.retrain_churn --rescore-only` untuk mengisi skor."
          />
        ) : (
          <div className="space-y-2">
            {(riskList.data || []).map((customer) => (
              <RiskRow
                key={customer.customer_id}
                customer={customer}
                freshScore={freshScores[customer.customer_id]}
                note={rowNotes[customer.customer_id]}
                isRecomputing={recomputingId === customer.customer_id}
                onRecompute={recompute}
              />
            ))}
            <p className="pt-2 text-xs text-ink-soft">
              Skor batch diperbarui harian. Tombol hitung ulang memanggil model
              dengan riwayat per detik ini. Akurasi model berbeda per jalur:
              prediksi untuk pelanggan berulang jauh lebih presisi daripada
              pemesan sekali, jadi gunakan nilai belanja sebagai pemecah seri.
            </p>
          </div>
        )}
      </Card>

      {actionError ? <ErrorState message={actionError} /> : null}
    </div>
  );
}
