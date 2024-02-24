<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { afterUpdate } from "svelte";
  import { getCards, getDecks } from "./lib/anki";

  afterUpdate(async () => {
    const res = await getCards("deck:current");
    console.log("body", res);
  });

  let position = "bottom";
</script>

<div class="w-screen h-screen flex flex-col">
  <!-- header -->
  <div class="w-full flex-shrink border-b border-b-black px-2">
    <h1 class="text-left">hexagram</h1>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button variant="outline" builders={[builder]}>Open</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-56">
        <DropdownMenu.Label>Panel Position</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.RadioGroup bind:value={position}>
          <DropdownMenu.RadioItem value="top">Top</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="bottom">Bottom</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="right">Right</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
  <!-- content -->
  <div class="flex flex-grow h-[1px]">
    <!--sidebar -->
    <div class="p-2 h-full basis-52 border-r border-r-black overflow-y-auto">
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
      <div>Vocab!</div>
    </div>
    <!-- content -->
    <div class="p-2">example sentences</div>
  </div>
</div>
