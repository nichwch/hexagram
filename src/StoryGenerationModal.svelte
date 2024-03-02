<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { createEventDispatcher } from "svelte";
  import { Input } from "./lib/components/ui/input";
  import Label from "./lib/components/ui/label/label.svelte";
  import Textarea from "./lib/components/ui/textarea/textarea.svelte";

  export let deckQuery: string;
  export let loadingStory: boolean;
  export let cards: string[];
  export let storyPrompt: string;

  let storyPromptInput: string = storyPrompt;
  const dispatch = createEventDispatcher();
</script>

<Dialog.Root
  onOpenChange={() => {
    console.log("OPEN", storyPrompt);
    storyPromptInput = storyPrompt;
  }}
>
  <Dialog.Trigger asChild let:builder>
    <Button class="w-full" builders={[builder]}>generate new story</Button>
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[700px]  ">
    <Dialog.Header>
      <Dialog.Title>Generate story</Dialog.Title>
    </Dialog.Header>
    <h1>Vocab</h1>
    <div>
      <Label for="deck_query" class="text-right"
        >Deck query for vocab to use</Label
      >
      <Input id="deck_query" value={deckQuery} />
    </div>
    <div>
      Vocab to use: <span class="text-green-800">
        {#each cards as vocab}
          <span class="mr-3">{vocab}</span>
        {/each}
      </span>
    </div>
    <!-- TODO: prompt for story -->
    <div>
      <Label for="prompt" class="text-right">Prompt for story</Label>
      <Textarea id="prompt" class="h-44" bind:value={storyPromptInput}
      ></Textarea>
    </div>
    <Button
      disabled={loadingStory}
      on:click={() => dispatch("submit", storyPromptInput)}
      >{#if loadingStory}
        generating story...
      {:else}
        generate story
      {/if}</Button
    >
  </Dialog.Content>
</Dialog.Root>
