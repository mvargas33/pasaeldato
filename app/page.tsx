"use client";

import Map from "./components/Map";
import SearchBox from "./components/SearchBox";
import ChipFilters from "./components/ChipFilter";
import TipCard from "./components/TipCard";
import UsersExample from "./components/UsersExample";
import AuthGuard from "./components/auth/AuthGuard";
import Header from "./components/Header";

export default function Home() {
  const mockTips = [
    { id: 1, title: "Titulo lorem ipsum lorem ipsum" },
    { id: 2, title: "Titulo lorem ipsum lorem ipsum" },
    { id: 3, title: "Titulo lorem ipsum lorem ipsum" },
    { id: 4, title: "Titulo lorem ipsum lorem ipsum" },
  ];

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Fixed Header */}
        <Header />

        {/* Main Content */}
        <main className="flex flex-col pt-24 px-6 pb-6 gap-6">
          {/* Search and Filters Section */}
          <section className="flex flex-col gap-4 mt-3">
            <SearchBox />
            <ChipFilters />
          </section>

          {/* Map Section */}
          <section className="w-full h-[400px] rounded-lg overflow-hidden">
            <Map />
          </section>

          {/* Tips List Section */}
          <section className="flex flex-col gap-4 mt-3">
            {mockTips.map((tip) => (
              <TipCard key={tip.id} title={tip.title} />
            ))}
          </section>
          <UsersExample />
        </main>
      </div>
    </AuthGuard>
  );
}
