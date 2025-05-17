import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ domain: string }>;
}

export default async function Page({ params }: Props) {
  const { domain } = await params;

  if (!domain) notFound();

  return <div>{domain}</div>;
}
