<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "./lib/components/ui/dialog";
  import InfoIcon from "./InfoIcon.svelte";

  export let prompt: string;
  export let vocabWords: string[];
</script>

<Dialog.Root>
  <Dialog.Trigger asChild let:builder>
    <Button class="rounded-none" variant="ghost" builders={[builder]}
      ><InfoIcon /></Button
    ></Dialog.Trigger
  >
  <Dialog.Content class="sm:max-w-[700px] h-3/4 overflow-y-auto">
    <Dialog.Header>
      <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Prompt</h4>
      <p>
        This story was generated with the following prompt: <span
          class="text-green-800">{prompt}</span
        >
      </p>
      <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Vocab</h4>
      <p>
        This story uses the following vocab: <span class="text-green-800"
          >{#each vocabWords as vocab}
            <span class="mr-3">{vocab}</span>
          {/each}</span
        >
      </p>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
