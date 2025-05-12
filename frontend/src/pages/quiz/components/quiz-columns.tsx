"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { QuizSummaryDto } from "@/model";
import { format } from "date-fns";
import QuizActions from "./quiz-actions";

export const quizResultColumns = (): ColumnDef<QuizSummaryDto>[] => {
  const baseColumns: ColumnDef<QuizSummaryDto>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "difficulty",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Difficulty
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "total_questions",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total questions
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "score",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "submitted_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Submitted at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const uploadedAt = row.original.submitted_at;
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
        const quizSummary = row.original;
        return <QuizActions quizSummary={quizSummary} />;
      },
    },
  ];

  return baseColumns;
};
