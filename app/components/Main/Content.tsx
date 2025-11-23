import Map from "../Map";
import SearchBox from "../SearchBox";
import ChipFilters from "../ChipFilter";
import TipCard from "../TipCard";
import { ComponentProps } from "react";
import { Community } from "@/types/app";

type Props = {
  mapPins: ComponentProps<typeof Map>["pins"];
  tips: (ComponentProps<typeof TipCard> & { id: string })[];
  communities: Community[];
  onChangeMapCenter: ComponentProps<typeof Map>["onChangeCenter"];
  onChangeSearch: (value: string) => void;
  onActiveSubtypesChange: (activeSubtypes: string[]) => void;
  onIsCommunityModeChange: (isCommunityMode: boolean) => void;
};

const Content = ({
  mapPins,
  tips,
  communities,
  onChangeMapCenter,
  onChangeSearch,
  onActiveSubtypesChange,
  onIsCommunityModeChange,
}: Props) => (
  <main
    className="flex flex-col pt-24 px-6 pb-6 gap-6"
    style={{ background: "var(--color-background)" }}
  >
    {/* Search and Filters Section */}
    <section className="flex flex-col gap-4 mt-3">
      <SearchBox onChange={onChangeSearch} />
      <ChipFilters
        onActiveSubtypesChange={onActiveSubtypesChange}
        onIsCommunityModeChange={onIsCommunityModeChange}
      />
    </section>

    {/* Map Section */}
    <section className="w-full h-[400px] rounded-lg overflow-hidden">
      <Map pins={mapPins} communities={communities} onChangeCenter={onChangeMapCenter} />
    </section>

    {/* Tips List Section */}
    <section className="flex flex-col gap-4 mt-3">
      {tips.length === 0 ? (
        <div
          className="w-full h-32 flex items-center justify-center rounded-lg"
          style={{ background: "var(--color-background)" }}
        >
          <span className="text-gray-500">No hay resultados</span>
        </div>
      ) : (
        tips.map((tip) => (
          <TipCard key={tip.id} title={tip.title} tipId={tip.id} authorId={tip.authorId} />
        ))
      )}
    </section>
  </main>
);

export default Content;
