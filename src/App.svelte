<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Dialog from "$lib/components/ui/dialog";
  import {
    DEFAULT_QUERY,
    DEFAULT_SENTENCE_PROMPT,
    JSON_BLOB,
    OPENAI_KEY,
    SENTENCE_PROMPT,
    getCards,
    reinitOpenAI,
    textCompletion,
  } from "./lib/api";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";

  // key value pair from vocab word to sentences
  let json_blob: { [key: string]: string[] } =
    JSON.parse(localStorage.getItem(JSON_BLOB) || "{}") || {};

  type Card = {
    fields: {
      Simplified: { value: string };
      Pinyin: { value: string };
      English: { value: string };
    };
  };
  let cards: Card[] = [];
  let focusedCard: Card | null = null;
  let editingSentences = false;
  let deckQuery = localStorage.getItem(DEFAULT_QUERY) || "deck:current";
  $: getCards(deckQuery).then((res) => (cards = res || []));

  let settingsDeckQueryInput =
    localStorage.getItem(DEFAULT_QUERY) || "deck:current";
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

  let loading = false;
  const generateSentence = async (vocabWord: string) => {
    let promptTemplate =
      localStorage.getItem(SENTENCE_PROMPT) || DEFAULT_SENTENCE_PROMPT;
    let prompt = promptTemplate.replace("$$vocabWord$$", vocabWord);
    loading = true;
    let result = await textCompletion(prompt);
    loading = false;
    if (result === null) return;
    if (json_blob[vocabWord] !== undefined) {
      json_blob[vocabWord].push(result);
    } else {
      json_blob[vocabWord] = [result];
    }
    json_blob = json_blob;
    persistBlob();
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
    <Dialog.Root>
      <Dialog.Trigger asChild let:builder>
        <Button class="rounded-none" variant="ghost" builders={[builder]}
          >settings</Button
        ></Dialog.Trigger
      >
      <Dialog.Content class="sm:max-w-[700px] h-3/4 overflow-y-auto">
        <Dialog.Header>
          <Dialog.Title>Edit settings</Dialog.Title>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="default_query" class="text-right"
              >Default deck query</Label
            >
            <Input
              id="default_query"
              bind:value={settingsDeckQueryInput}
              class="col-span-3"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="api_key" class="text-right">OpenAI API key</Label>
            <Input
              id="api_key"
              bind:value={settingsOpenAIKeyInput}
              class="col-span-3"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="sentence_prompt" class="text-right"
              >Prompt for sentence generation (use $$vocabWord$$ where the vocab
              word would be)</Label
            >
            <Textarea
              id="sentence_prompt"
              bind:value={sentencePromptInput}
              class="h-48 col-span-3"
            />
          </div>
        </div>
        <Button
          class="col-span-1"
          on:click={() => (sentencePromptInput = DEFAULT_SENTENCE_PROMPT)}
          >reset sentence prompt to default</Button
        >
      </Dialog.Content>
    </Dialog.Root>
    <Dialog.Root>
      <Dialog.Trigger asChild let:builder>
        <Button
          class="rounded-none float-right"
          variant="ghost"
          builders={[builder]}>settings</Button
        ></Dialog.Trigger
      >
      <Dialog.Content class="sm:max-w-[500px]">
        <Dialog.Header>
          <Dialog.Title>Getting started</Dialog.Title>
        </Dialog.Header>
        <div>
          <p>To get started, set up the AnkiConnect add on in Anki.</p>
          <p class="mt-3">
            Once you have set up AnkiConnect, go to the add on configs and set
            "webCorsOriginList" to include "http://localhost:1420".
          </p>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  </div>
  <!-- content -->
  <div class="flex flex-grow h-[1px]">
    <!--sidebar -->
    <div class="p-2 h-full basis-52 border-r border-r-black overflow-y-auto">
      {#each cards as card}
        {@const currCard = card.fields.Simplified.value}
        <button
          class:bg-red-300={focusedCard?.fields.Simplified.value === currCard}
          class="text-xl w-full font-normal flex items-center px-3"
          on:click={() => ((focusedCard = card), (editingSentences = false))}
        >
          {currCard}
          {#if json_blob[currCard] !== undefined}
            <span class="ml-auto text-sm text-red-800">
              ({json_blob[currCard].length})
            </span>
          {/if}
        </button>{/each}
    </div>
    <!-- content -->
    <div class="p-2 p flex-grow">
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
              >{#if loading}
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
    </div>
  </div>
</div>
