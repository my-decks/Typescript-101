import { CornerMarks, Footer, Progress } from "stagesmith";

export default function CommonOverlay() {
  return (
    <>
      <CornerMarks inset={20} />
      <Footer text="VS Code & TS" />
      <Progress />
    </>
  );
}
