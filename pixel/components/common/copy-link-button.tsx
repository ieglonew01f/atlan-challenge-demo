"use client";

import { Check, LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface CopyLinkButtonProps {
  link: string;
  isDisabled: boolean;
}

export function CopyLinkButton({ link, isDisabled }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast("Link copied!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast("Failed to copy");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      disabled={isDisabled}
      className="flex items-center space-x-1"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <LinkIcon className="h-4 w-4" />
      )}
    </Button>
  );
}