import MarketplaceClient from "./ui";

export default function MarketplacePage() {
  return (
    <div className="py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Marketplace</h1>
          <p className="text-sm text-white/60 mt-1">Browse astrologers, filter, and start a chat.</p>
        </div>
      </div>
      <div className="mt-6">
        <MarketplaceClient />
      </div>
    </div>
  );
}
