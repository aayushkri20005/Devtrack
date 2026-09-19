import { useContext } from "react";
import { Store } from "../store";
import companies from "../data/companies";
import { ProgressTable } from "../components/ui";

export default function Companies() {
  const { problems } = useContext(Store);
  const rows = companies.map((name) => {
    const list = problems.filter((p) => p.companies.includes(name));
    return { name, total: list.length, solved: list.filter((p) => p.solved).length };
  });
  return <ProgressTable heading="Company" rows={rows} />;
}
