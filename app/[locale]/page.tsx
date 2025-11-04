import HeroButtons from "@/components/HeroButtons";
import ListPlayers from "@/components/ListPlayers";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import GetPokemonOfTheDayServer from "@/components/GetPokemonOfTheDayServer";

interface HomePageProps {
  params: {
    locale: string;
  };
}

export default function HomePage({ params }: HomePageProps): React.JSX.Element {
  const { locale } = params;
  const shadowColor = "white";

  return (
    <main>
      <div className="relative overflow-hidden flex flex-col items-center justify-center py-10">
        <h1 className="text-6xl md:text-8xl font-semibold select-none">
          Poke
          <LineShadowText className="italic" shadowColor={shadowColor}>
            Quiz
          </LineShadowText>
        </h1>
        <HeroButtons />
        <GetPokemonOfTheDayServer locale={locale} />
        <ListPlayers />
      </div>
    </main>
  );
}
