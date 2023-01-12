import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const response = await fetch(
      `https://abilityarena.com/api/games/${req.query.id}`
    );

    const json = await response.json();

    res.send(json.players.map((p: { ladder_mmr: number }) => p.ladder_mmr));
  } catch (e) {
    res.status(422).send({ message: "something went wrong" });
  }
}
