<script lang="ts">
  import HelpModal from "./HelpModal.svelte";

  import SettingsModal from "./SettingsModal.svelte";
  import { nanoid } from "nanoid";

  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import {
    DEFAULT_DECK_QUERY,
    DEFAULT_QUERY,
    DEFAULT_SENTENCE_PROMPT,
    JSON_BLOB,
    OPENAI_KEY,
    SENTENCE_PROMPT,
    STORIES,
    getCards,
    reinitOpenAI,
    textCompletion,
  } from "./lib/api";
  import { Input } from "$lib/components/ui/input";
  import * as Tabs from "$lib/components/ui/tabs";
  import StoryGenerationModal from "./StoryGenerationModal.svelte";
  import { Switch } from "./lib/components/ui/switch";
  import { Label } from "./lib/components/ui/label";

  // key value pair from vocab word to sentences
  let json_blob: { [key: string]: string[] } =
    JSON.parse(localStorage.getItem(JSON_BLOB) || "{}") || {};

  let stories: Story[] =
    JSON.parse(localStorage.getItem(STORIES) || "[]") || [];
  let focusedStory: Story | null = null;
  $: splitStory = focusedStory
    ? focusedStory?.story.split(
        new RegExp("(" + focusedStory?.vocab.join("|") + ")")
      )
    : [];
  $: storyVocabSet = new Set(focusedStory?.vocab || []);
  let highlightVocab = true;

  let displaying: "vocab" | "stories" = "vocab";

  type Card = {
    fields: {
      Simplified: { value: string };
      Pinyin: { value: string };
      English: { value: string };
    };
  };

  type Story = {
    id: string;
    vocab: string[];
    story: string;
    prompt: string;
  };

  let cards: Card[] = [];
  let focusedCard: Card | null = null;
  let editingSentences = false;
  let deckQuery = localStorage.getItem(DEFAULT_QUERY) || DEFAULT_DECK_QUERY;
  $: getCards(deckQuery).then((res) => (cards = res || []));

  let settingsDeckQueryInput =
    localStorage.getItem(DEFAULT_QUERY) || DEFAULT_DECK_QUERY;
  let settingsOpenAIKeyInput = localStorage.getItem(OPENAI_KEY) || "";
  let sentencePromptInput =
    localStorage.getItem(SENTENCE_PROMPT) || DEFAULT_SENTENCE_PROMPT;

  $: localStorage.setItem(DEFAULT_QUERY, settingsDeckQueryInput);
  $: localStorage.setItem(SENTENCE_PROMPT, sentencePromptInput);
  $: {
    localStorage.setItem(OPENAI_KEY, settingsOpenAIKeyInput);
    reinitOpenAI();
  }

  const persistBlob = () => {
    localStorage.setItem(JSON_BLOB, JSON.stringify(json_blob));
  };

  const persistStories = () => {
    localStorage.setItem(STORIES, JSON.stringify(stories));
  };

  let loadingStory = false;
  let loadingSentence = false;

  const generateSentence = async (vocabWord: string) => {
    let promptTemplate =
      localStorage.getItem(SENTENCE_PROMPT) || DEFAULT_SENTENCE_PROMPT;
    let prompt = promptTemplate.replace("$$vocabWord$$", vocabWord);
    loadingSentence = true;
    let result = await textCompletion(prompt);
    loadingSentence = false;
    if (result === null) return;
    if (json_blob[vocabWord] !== undefined) {
      json_blob[vocabWord].push(result);
    } else {
      json_blob[vocabWord] = [result];
    }
    json_blob = json_blob;
    persistBlob();
  };

  const generateStory = async () => {
    let allVocab = cards.map((card) => card.fields.Simplified.value).join(", ");
    let vocabArr = cards.map((card) => card.fields.Simplified.value);
    let promptTemplate = `Write me a story in Chinese using Simplified characters, using the following vocabulary $$vocab$$. 
    
    Make it about a young man in his twenties living in New York City. Use simpler vocabulary, appropriate for HSK3 level reading.`;

    let prompt = promptTemplate.replace("$$vocab$$", allVocab);
    loadingStory = true;
    let result = await textCompletion(prompt);
    if (result === null) throw new Error("Story generation failed");
    let storyId = nanoid();

    stories = [
      ...stories,
      {
        id: storyId,
        prompt: promptTemplate,
        vocab: vocabArr,
        story: result,
      },
    ];
    loadingStory = false;
    persistStories();
  };

  const deleteSentence = async (vocabWord: string, index: number) => {
    if (json_blob[vocabWord] === undefined) return;
    let sentences = json_blob[vocabWord];
    sentences.splice(index, 1);
    json_blob = json_blob;
    persistBlob();
  };
</script>

<div class="w-screen h-screen flex flex-col">
  <!-- header -->
  <div class="w-full flex-shrink border-b border-b-black px-2">
    <h1 class="text-left inline-block">hexagram</h1>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button class="rounded-none" variant="ghost" builders={[builder]}
          >deck query</Button
        >
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-56">
        <Input placeholder="example - deck:current" bind:value={deckQuery} />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
    <SettingsModal
      bind:settingsDeckQueryInput
      bind:settingsOpenAIKeyInput
      bind:sentencePromptInput
    ></SettingsModal>
    <HelpModal />
  </div>
  <!-- content -->
  <div class="flex flex-grow h-[1px]">
    <!--sidebar -->
    <div class="p-2 h-full basis-52 border-r border-r-black overflow-y-auto">
      <Tabs.Root bind:value={displaying}>
        <Tabs.List class="sticky top-0 grid w-full grid-cols-2">
          <Tabs.Trigger value="vocab">vocab</Tabs.Trigger>
          <Tabs.Trigger value="stories">stories</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="vocab">
          {#each cards as card}
            {@const currCard = card.fields.Simplified.value}
            <button
              class:bg-red-300={focusedCard?.fields.Simplified.value ===
                currCard}
              class="text-xl w-full font-normal flex items-center px-3"
              on:click={() => (
                (focusedCard = card), (editingSentences = false)
              )}
            >
              {currCard}
              {#if json_blob[currCard] !== undefined}
                <span class="ml-auto text-sm text-red-800">
                  ({json_blob[currCard].length})
                </span>
              {/if}
            </button>{/each}
        </Tabs.Content>
        <Tabs.Content value="stories">
          <StoryGenerationModal
            bind:deckQuery
            {loadingStory}
            on:submit={() => generateStory()}
          />
          {#each stories as story}
            <button on:click={() => (focusedStory = story)}>
              {story.story.substring(0, 10)}...
            </button>
          {/each}
        </Tabs.Content>
      </Tabs.Root>
    </div>
    <!-- content -->
    <div class="p-2 flex-grow overflow-y-scroll">
      {#if displaying === "vocab"}
        {#if focusedCard !== null}
          {@const cardVal = focusedCard.fields.Simplified.value}
          <div class="w-[500px] mx-auto pt-8">
            <h1 class="text-xl">
              {cardVal}:
            </h1>
            <p class="italic">{focusedCard.fields.Pinyin.value}</p>
            <p class="italic">{focusedCard.fields.English.value}</p>
            <h1 class="my-3 text-xl">
              example sentences for {cardVal}:
            </h1>
            {#each json_blob[cardVal] || [] as sentence, index}
              <div>
                {#if editingSentences}
                  <Button
                    on:click={() => deleteSentence(cardVal, index)}
                    class="rounded-none"
                    variant="destructive">x</Button
                  >
                {/if}
                {sentence}
              </div>
            {/each}
            <div class="mt-3">
              <Button
                variant="outline"
                class=""
                on:click={() => generateSentence(cardVal || "")}
                >{#if loadingSentence}
                  loading new sentence...
                {:else}
                  generate new sentence
                {/if}</Button
              >
              <Button
                variant={editingSentences ? undefined : "secondary"}
                class="ml-2"
                on:click={() => (editingSentences = !editingSentences)}
                >{#if editingSentences}
                  done
                {:else}
                  edit sentences
                {/if}</Button
              >
            </div>
          </div>
        {:else}
          no card selected
        {/if}
      {:else if displaying === "stories"}
        {#if focusedStory !== null}
          <div class="w-[500px] mx-auto py-8 leading-10">
            <div class="flex items-center space-x-2 mb-2">
              <Switch id="highlight-vocab" bind:checked={highlightVocab} />
              <Label for="highlight-vocab">Highlight vocab</Label>
            </div>
            {#each splitStory as fragment}
              <span
                class:text-red-700={storyVocabSet.has(fragment) &&
                  highlightVocab}>{fragment}</span
              >
            {/each}
          </div>
        {:else}
          no story selected
        {/if}
      {/if}
    </div>
  </div>
</div>
