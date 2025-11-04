import { GridPattern } from "./ui/grid-pattern";

const GridBg = () => {
  return (
    <GridPattern
      squares={[
        [4, 4],
        [5, 1],
        [8, 2],
        [5, 3],
        [5, 5],
        [10, 10],
        [12, 15],
        [15, 10],
        [10, 15],
        [15, 10],
        [10, 15],
        [15, 10],
      ]}
      className={"inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"}
    />
  );
};

export default GridBg;
