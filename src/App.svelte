<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Dialog from "$lib/components/ui/dialog";
  import {
    DEFAULT_QUERY,
    JSON_BLOB,
    OPENAI_KEY,
    getCards,
    getDecks,
    openai,
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
  let deckQuery = localStorage.getItem(DEFAULT_QUERY) || "deck:current";
  $: getCards(deckQuery).then((res) => (cards = res || []));

  let settingsDeckQueryInput =
    localStorage.getItem(DEFAULT_QUERY) || "deck:current";
  let settingsOpenAIKeyInput = localStorage.getItem(OPENAI_KEY) || "";

  $: localStorage.setItem(DEFAULT_QUERY, settingsDeckQueryInput);
  $: {
    localStorage.setItem(OPENAI_KEY, settingsOpenAIKeyInput);
    reinitOpenAI();
  }

  const persistBlob = () => {
    localStorage.setItem(JSON_BLOB, JSON.stringify(json_blob));
  };

  let loading = false;
  const generateSentence = async (vocabWord: string) => {
    let prompt = `Generate an example Chinese sentence using Simplified characters using the vocab word: ${vocabWord}. Use beginner level vocabulary. Only return the example sentence.`;
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
      <Dialog.Content class="sm:max-w-[700px]">
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
        </div>
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
          class="text-xl text-center w-full font-normal block"
          on:click={() => (focusedCard = card)}
        >
          {currCard}
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
          {#each json_blob[cardVal] || [] as sentence}
            <div>{sentence}</div>
          {/each}
          <Button
            variant="outline"
            class="block mt-3"
            on:click={() => generateSentence(cardVal || "")}
            >{#if loading}
              loading new sentence...
            {:else}
              generate new sentence
            {/if}</Button
          >
        </div>
      {:else}
        no card selected
      {/if}
    </div>
  </div>
</div>
