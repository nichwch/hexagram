<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { afterUpdate } from "svelte";
  import { getCards, getDecks, textCompletion } from "./lib/anki";
  import { Input } from "$lib/components/ui/input";

  let cards: { fields: { Simplified: { value: string } } }[] = [];
  let focusedCard: string | null = null;
  let deckQuery = "deck:current";

  afterUpdate(async () => {
    console.log("dq", deckQuery);
    const res = await getCards(deckQuery);
    cards = res;
  });
</script>

<div class="w-screen h-screen flex flex-col">
  <!-- header -->
  <div class="w-full flex-shrink border-b border-b-black px-2">
    <h1 class="text-left inline-block">hexagram</h1>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button class="" variant="outline" builders={[builder]}
          >deck query</Button
        >
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-56">
        <Input placeholder="example - deck:current" bind:value={deckQuery} />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
  <!-- content -->
  <div class="flex flex-grow h-[1px]">
    <!--sidebar -->
    <div class="p-2 h-full basis-52 border-r border-r-black overflow-y-auto">
      {#each cards as card}
        <button
          class="text-xl text-center w-full font-normal block"
          on:click={() => (focusedCard = card.fields.Simplified.value)}
        >
          {card.fields.Simplified.value}
        </button>{/each}
    </div>
    <!-- content -->
    <div class="p-2">example sentences for {focusedCard}</div>
  </div>
</div>
