import React from "react";
import HomePage from "./HomePage";
import GetPokemonOfTheDayServer from "@/components/GetPokemonOfTheDayServer";

interface PageProps {
  params: {
    locale: string;
  };
}

const Page = ({ params }: PageProps): React.JSX.Element => {
  return (
    <HomePage>
      <GetPokemonOfTheDayServer locale={params.locale} />
    </HomePage>
  );
};

export default Page;
