import Image from "next/image";
import Map from "./components/Map";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          src="/web-app-manifest-512x512.png"
          alt="Pasa el dato"
          width={16}
          height={16}
        />
        <Map />
      </main>
    </div>
  );
}
