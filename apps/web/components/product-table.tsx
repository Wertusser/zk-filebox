"use client";

import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon } from "lucide-react";
import { DataTable } from "./ui/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "header",
    header: "Name",
    cell: ({ row }) => {
      return <div />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: "Price",
    cell: ({ row }) => {
      return <div />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: "Status",
    cell: ({ row }) => {
      return <div />;
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
        <Button variant="default" size="sm">
          <PlusIcon />
          <span>Add Product</span>
        </Button>
      </div>

      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
