"use client";

import { AlertCircle, Database, Settings2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQueryContext } from "../providers/query-context-provider";

interface SqlAiAnalysisPopoverProps {
  query: string;
}

export function SqlAiAnalysisPopover({ query }: SqlAiAnalysisPopoverProps) {
  const { selectedQuery } = useQueryContext();

  const analysis = {
    summary: "This query fetches customer data filtered by monthly_usuage and revenew in the last 30 days.",
    tables: ["customers", "sales"],
    potentialIssues: [
      "Missing index on 'customer_id' may cause scan.",
      "No LIMIT clause — might fetch too much data.",
    ],
    suggestions: [
      "Consider indexing 'customer_id'.",
      "Add LIMIT if previewing data.",
    ],
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" disabled={!selectedQuery}>
          <Sparkles className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-4 space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">✨ AI Analysis</h4>

        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">Summary:</p>
            <p className="text-sm">{analysis.summary}</p>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">Tables used:</p>
          <div className="flex gap-1 flex-wrap">
            {analysis.tables.map((table) => (
              <Badge key={table} variant="secondary">{table}</Badge>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-yellow-600">Potential issues:</p>
            <ul className="text-sm list-disc ml-4 mt-1 text-yellow-700">
              {analysis.potentialIssues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Settings2 className="h-4 w-4 text-green-600 mt-1" />
          <div>
            <p className="text-sm font-medium text-green-700">Suggestions:</p>
            <ul className="text-sm list-disc ml-4 mt-1 text-green-700">
              {analysis.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
