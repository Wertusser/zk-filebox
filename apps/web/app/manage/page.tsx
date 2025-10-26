"use client";

import { ProductsTable } from "@/components/product-table";
import { ProtocolStatistics } from "@/components/protocol-statistics";

export default function ManagePage() {
  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="@container/main flex flex-1 flex-col gap-2 w-5xl">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <ProtocolStatistics />
          <ProductsTable data={[]} />
        </div>
      </div>
    </div>
  );
}
