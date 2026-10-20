import { Glow, GridLines, Vignette } from "stagesmith";

export default function CommonBg() {
  return (
    <>
      <Glow />
      <GridLines />
      <Vignette strength={0.32} />
    </>
  );
}
