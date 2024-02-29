<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { createEventDispatcher } from "svelte";
  import { Input } from "./lib/components/ui/input";

  export let deckQuery: string;
  export let loadingStory: boolean;

  const dispatch = createEventDispatcher();
</script>

<Dialog.Root>
  <Dialog.Trigger asChild let:builder>
    <Button class="w-full" builders={[builder]}>generate new story</Button>
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[700px] overflow-y-auto h-3/4 ">
    <Dialog.Header>
      <Dialog.Title>Generate story</Dialog.Title>
    </Dialog.Header>
    <h1>Vocab</h1>
    <Input value={deckQuery} />
    <Button disabled={loadingStory} on:click={() => dispatch("submit")}
      >{#if loadingStory}
        generating story...
      {:else}
        generate story
      {/if}</Button
    >
  </Dialog.Content>
</Dialog.Root>
