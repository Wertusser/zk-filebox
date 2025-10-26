"use client";

import { ProductsTable } from "@/components/product-table";
import { ProtocolStatistics } from "@/components/protocol-statistics";

export default function ManagePage() {
  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="@container/main flex flex-1 flex-col gap-2 w-5xl">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <ProtocolStatistics />
          <ProductsTable
            data={[
              { name: "“The Creative Blueprint: Mastering Modern Design Thinking”", price: "10,00", status: "Active" },
              { name: "“Zero to Launch: Build Your First Online Income Stream”", price: "15,00", status: "Active" },
              { name: "“Mindshift: A Guide to Reprogram Your Daily Habits”", price: "5,99", status: "Active" },
              { name: "StreamLoom — gives a sense of connection and creation", price: "6,99", status: "Active" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
