import React from "react";
import GameTemplate from "@/components/games/GameTemplate";
import GameDescription from "@/components/games/GameDescription";
const SlotsGame = () => {
  return (
    <GameTemplate
      game={""}
      description={
        <GameDescription title="Slots">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum
          earum quos, suscipit sed nobis excepturi distinctio quidem quas ullam
          blanditiis dolores sit quo corporis! Provident possimus a magni id
          modi? Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
          earum quos, suscipit sed nobis excepturi distinctio quidem quas ullam
          blanditiis dolores sit quo corporis! Provident possimus a magni id
          modi?
        </GameDescription>
      }
    />
  );
};

export default SlotsGame;
