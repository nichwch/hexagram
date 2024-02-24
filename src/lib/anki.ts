export const getDecks = async () => {
  const res = await fetch("http://localhost:8765", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "deckNames",
      version: 6,
    }),
    mode: "cors",
  });
  const body = await res.json();
  return body.result;
};

export const getCards = async (query: string) => {
  const res = await fetch("http://localhost:8765", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "findCards",
      version: 6,
      params: {
        query,
      },
    }),
    mode: "cors",
  });
  const body = await res.json();
  const cardIds = body.result;

  const res2 = await fetch("http://localhost:8765", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "cardsInfo",
      version: 6,
      params: {
        cards: cardIds,
      },
    }),
    mode: "cors",
  });
  const body2 = await res2.json();
  return body2.result;
};
