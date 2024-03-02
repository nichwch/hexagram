import { OpenAI } from "openai";

export const DEFAULT_QUERY = "DEFAULT_QUERY";
export const OPENAI_KEY = "OPENAI_KEY";
export const JSON_BLOB = "JSON_BLOB";
export const SENTENCE_PROMPT = "SENTENCE_PROMPT";
export const STORY_PROMPT = "STORY_PROMPT";
export const STORIES = "STORIES";

export const DEFAULT_SENTENCE_PROMPT =
  "Generate an example Chinese sentence using Simplified characters using the vocab word: $$vocabWord$$. Use beginner level vocabulary. Only return the example sentence.";

export const DEFAULT_STORY_PROMPT = `Write me a story in Chinese using Simplified characters, using the following vocabulary: $$vocabWord$$. 

Make it about a young man in his twenties living in New York City. Use simpler vocabulary, appropriate for HSK3 level reading.`;

export const DEFAULT_DECK_QUERY = "prop:due=0 OR rated:1";
export let openai = new OpenAI({
  apiKey: localStorage.getItem(OPENAI_KEY), // This is the default and can be omitted
  dangerouslyAllowBrowser: true,
});

export const reinitOpenAI = () => {
  openai = new OpenAI({
    apiKey: localStorage.getItem(OPENAI_KEY), // This is the default and can be omitted
    dangerouslyAllowBrowser: true,
  });
};

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

export const textCompletion = async (prompt: string) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4",
    temperature: 0.7,
  });
  return chatCompletion?.choices[0]?.message.content;
};
