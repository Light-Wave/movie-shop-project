import { Badge } from "./ui/badge";
import Link from "next/link";

type Params = {
  name: string;
  id: string;
  adminView?: boolean;
};
export function MovieBadge({ name, id, adminView }: Params) {
  return (
    <Badge asChild>
      <Link href={adminView ? `/admin/manage-products/${id}` : `/browse/${id}`}>
        {name}
      </Link>
    </Badge>
  );
}
