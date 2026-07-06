import { Composition } from "remotion";
import { QuickStart } from "./QuickStart";
import { AdminUITour } from "./AdminUITour";
import { DeployTour } from "./DeployTour";
import { TeamsBotTour } from "./TeamsBotTour";
import { AstroIntegrationTour } from "./AstroIntegrationTour";
import { SchemaBuilderTour } from "./SchemaBuilderTour";
import { SearchTour } from "./SearchTour";
import { MediaLibraryTour } from "./MediaLibraryTour";

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
      <Composition
        id="TeamsBotTour"
        component={TeamsBotTour}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AstroIntegrationTour"
        component={AstroIntegrationTour}
        durationInFrames={470}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SchemaBuilderTour"
        component={SchemaBuilderTour}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SearchTour"
        component={SearchTour}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MediaLibraryTour"
        component={MediaLibraryTour}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
