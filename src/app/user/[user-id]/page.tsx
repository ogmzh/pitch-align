import { SetUUID } from "@/components/set-uuid-hack";

export default function Page({ params }: { params: { "user-id": string } }) {
  return <SetUUID uuid={params["user-id"]} />;
}
