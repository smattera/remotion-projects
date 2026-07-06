import { Composition } from "remotion";
import { QuickStart } from "./QuickStart";
import { AdminUITour } from "./AdminUITour";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="QuickStart"
        component={QuickStart}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AdminUITour"
        component={AdminUITour}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
