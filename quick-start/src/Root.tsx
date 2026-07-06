import { Composition } from "remotion";
import { QuickStart } from "./QuickStart";
import { AdminUITour } from "./AdminUITour";
import { DeployTour } from "./DeployTour";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="QuickStart"
        component={QuickStart}
        durationInFrames={285}
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
      <Composition
        id="DeployTour"
        component={DeployTour}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
