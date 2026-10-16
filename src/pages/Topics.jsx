import { useContext } from "react";
import { Store } from "../store";
import { topics } from "../data/problems";
import { ProgressTable } from "../components/ui";

export default function Topics() {
  const { problems } = useContext(Store);
  const rows = topics.map((name) => {
    const list = problems.filter((p) => p.topic === name);
    return { name, total: list.length, solved: list.filter((p) => p.solved).length };
  });
  return <ProgressTable heading="Topic" rows={rows} />;
}
