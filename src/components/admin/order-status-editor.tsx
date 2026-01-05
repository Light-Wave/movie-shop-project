"use client";

import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { Check } from "lucide-react";
import { setOrderStatusAction } from "@/server-actions/order/orderStatus";

export default function OrderStatusEditor({
  orderId,
  currentStatus,
  statuses,
}: {
  orderId: string;
  currentStatus: string;
  statuses: string[];
}) {
  const [selected, setSelected] = useState(currentStatus);
  const [state, formAction] = useActionState(setOrderStatusAction, {
    success: false,
  });

  return (
    <form action={formAction} className="flex items-center gap-3">
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="status" value={selected} />

      <Select value={selected} onValueChange={(v) => setSelected(v)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit">Update</Button>

      {state?.success && (
        <span className="text-sm text-green-600 flex items-center gap-1">
          <Check className="size-4" /> Updated
        </span>
      )}
      {"error" in (state || {}) && state?.error && (
        <span className="text-sm text-red-600">{state.error}</span>
      )}
    </form>
  );
}
