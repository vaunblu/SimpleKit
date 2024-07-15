"use client";

import { useSimpleKit } from "@/components/simplekit";
import { Button } from "@/components/ui/button";

export function OpenModalButton() {
  const simplekit = useSimpleKit();

  return <Button onClick={simplekit.open}>Open SimpleKit Modal</Button>;
}
