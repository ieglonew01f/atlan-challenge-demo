"use client"

import Analyze from "@/features/analyze/components/analyze";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  return <Analyze queryId={id} />;
}