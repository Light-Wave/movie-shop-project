"use client";
// Browse movies (optional filtering)
// o By genre
// o By director
// o By actor
//  Search functionality for movies (basic search by title)

// Add movies to cart (stored in cookies)

// Optional - Implement more complex filters (e.g., release year range, runtime, multiple genres)
// Optional Allow customers to rate and review purchased movies
// Optional Enable users to add movies to a wishlist for future purchase
// Optinal Add functionality to link and display movie trailers (embedded YouTube videos)
// Optinal Add buttons to share movie links on social media platforms

/*
Optinal:
7. Advanced Search
o Implement full-text search for movies using PostgreSQL's full-text search
capabilities
o Include search by director, actor, and genre*/

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import AddToCartButton from "@/components/cartComponents/addToCartButton";
import { generateMovieUrl } from "@/components/sharedutils/slug-utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PriceDisplay from "./prise-display";
import { HoverCardMovie } from "./movie-hover-details";
import { MovieWithDetails } from "./types/movie";
import placeholder from "../../public/placeholders/placeholder.jpg";

const columns: ColumnDef<MovieWithDetails>[] = [
  {
    accessorKey: "imageUrl",
    header: "Poster",
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageUrl") as string | null;
      const title = row.getValue("title") as string;
      return (
        <div className="relative h-[60px] w-10 overflow-hidden rounded-md bg-muted">
          {imageUrl && (
            <Image
              src={imageUrl || placeholder}
              alt={title || "Movie poster"}
              fill
              className="object-cover"
              sizes="40px"
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <HoverCardMovie movie={row.original}>
        <div className="capitalize">{row.getValue("title")}</div>
      </HoverCardMovie>
    ),
  },
  {
    accessorKey: "releaseDate",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Release Date
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const time = row.getValue("releaseDate") as Date;

      return (
        <div className="text-right font-medium">
          {time.toLocaleDateString("en")}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseInt(row.getValue("price"));

      return (
        <div className="text-right font-medium">
          <PriceDisplay price={amount} />
        </div>
      );
    },
  },
  {
    id: "addToCart",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <AddToCartButton
            movieId={row.original.id}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white border-none shadow-sm"
          />
        </div>
      );
    },
  },
];
type Params = { data: MovieWithDetails[] };

export function MovieTable({ data }: Params) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const router = useRouter();

  // Sync internal table filter with global search param
  const searchParams = useSearchParams();
  const globalSearch = searchParams.get("search");

  useEffect(() => {
    if (globalSearch !== null) {
      table.getColumn("title")?.setFilterValue(globalSearch);
    }
  }, [globalSearch, table]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter titles..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(
                      generateMovieUrl(row.original.id, row.original.title)
                    )
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
