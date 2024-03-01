<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";

  import * as Dialog from "$lib/components/ui/dialog";
  import { DEFAULT_SENTENCE_PROMPT, DEFAULT_STORY_PROMPT } from "./lib/api";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";

  export let settingsDeckQueryInput: string;
  export let settingsOpenAIKeyInput: string;
  export let sentencePromptInput: string;
  export let storyPromptInput: string;
</script>

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
        <Label for="default_query" class="text-right">Default deck query</Label>
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
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="story_prompt" class="text-right"
          >Prompt for story generation (use $$vocabWord$$ where the vocab word
          would be)</Label
        >
        <Textarea
          id="story_prompt"
          bind:value={storyPromptInput}
          class="h-48 col-span-3"
        />
      </div>
    </div>
    <Button
      class="col-span-1"
      on:click={() => (sentencePromptInput = DEFAULT_SENTENCE_PROMPT)}
      >reset sentence prompt to default</Button
    >
    <Button
      class="col-span-1"
      on:click={() => (storyPromptInput = DEFAULT_STORY_PROMPT)}
      >reset sentence prompt to default</Button
    >
  </Dialog.Content>
</Dialog.Root>
