"use client";

import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

import { DataTable } from "./ui/data-table";
import { Card, CardContent, CardTitle } from "./ui/card";
import { AddProductDialog } from "./add-product-dialog";
import { Badge } from "./ui/badge";

export const schema = z.object({
  name: z.string(),
  price: z.string(),
  status: z.string(),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <span>{row.original.name}</span>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return <span>{row.original.price} PYUSD</span>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge>
          <span>{row.original.status}</span>
        </Badge>
      );
    },
    enableHiding: false,
  },
  {
    id: "actions",
    cell: () => <div></div>,
  },
];

export function ProductsTable({ data }: { data: z.infer<typeof schema>[] }) {
  return (
    <Card className="bg-zinc-950 relative w-full flex flex-col gap-6">
      <div className="flex justify-between items-center px-6">
        <CardTitle>All products</CardTitle>
        <AddProductDialog />
      </div>

      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
