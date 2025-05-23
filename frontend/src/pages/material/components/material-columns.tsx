"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { MaterialDto } from "@/model";
import { format } from "date-fns";
import MaterialActions from "./material-actions";

export const materialColumns = (
  role: string,
  setSelectedMaterial: (materialDto: MaterialDto) => void,
  setIsDeleteDialogOpen: (open: boolean) => void
): ColumnDef<MaterialDto>[] => {
  const baseColumns: ColumnDef<MaterialDto>[] = [
    {
      accessorKey: "subject",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Subject
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const description: string = row.original.description;
        return description.length > 75
          ? `${description.substring(0, 75)}...`
          : description;
      },
    },
    {
      accessorKey: "file",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          File
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const filePath = row.original.file;
        const fileName = filePath.split("/")[2];
        return fileName;
      },
    },
    {
      accessorKey: "is_processed",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Is processed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const category = row.original.category;
        return category ? category.name : "";
      },
    },
    {
      accessorKey: "uploaded_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Uploaded at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const uploadedAt = row.original.uploaded_at;
        const formattedDate = format(
          new Date(uploadedAt),
          "d MMMM yyyy, HH:mm:ss"
        );
        return formattedDate;
      },
    },
    {
      id: "actions",
      header: () => <Button variant="ghost">Actions</Button>,
      cell: ({ row }) => {
        return (
          <MaterialActions
            material={row.original}
            setSelectedMaterial={setSelectedMaterial}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          />
        );
      },
    },
  ];

  const adminColumn: ColumnDef<MaterialDto>[] = [
    {
      accessorKey: "user",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original.user;
        return `${user.username}`;
      },
    },
  ];

  return role === "ADMIN" ? [...baseColumns, ...adminColumn] : baseColumns;
};
