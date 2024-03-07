<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";

  import * as Dialog from "$lib/components/ui/dialog";
  import {
    DEFAULT_SENTENCE_PROMPT,
    DEFAULT_STORY_PROMPT,
    type Card,
  } from "./lib/api";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Select from "$lib/components/ui/select";
  import * as Popover from "$lib/components/ui/popover";
  import { Checkbox } from "$lib/components/ui/checkbox";

  export let settingsDeckQueryInput: string;
  export let settingsOpenAIKeyInput: string;
  export let sentencePromptInput: string;
  export let storyPromptInput: string;
  export let deckInput: string;
  export let decks: string[];
  export let card: Card;
  export let fields: string[];

  let vocabFieldInput: string = fields[0];
  let fieldInput: string[] = fields.slice(1);
  $: fields = [vocabFieldInput, ...fieldInput];
  $: cardFields = Array.from(Object.keys(card?.fields || {}));
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
        <Label for="deck" class="text-right">Deck</Label>
        <Select.Root
          portal={null}
          onSelectedChange={(v) => (deckInput = v?.value || "")}
          selected={{ value: deckInput, label: deckInput }}
        >
          <Select.Trigger class="w-[180px]" id="deck">
            <Select.Value placeholder="Select a deck to use" />
          </Select.Trigger>
          <Select.Content>
            <Select.Group class="max-h-[18rem] overflow-y-auto">
              <Select.Label>Decks</Select.Label>
              {#each decks as deck}
                <Select.Item value={deck} label={deck}>{deck}</Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
          <Select.Input name="favoriteFruit" />
        </Select.Root>
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="deck" class="text-right">Vocab field</Label>
        <Select.Root
          portal={null}
          onSelectedChange={(v) => (vocabFieldInput = v?.value || "")}
          selected={{ value: vocabFieldInput, label: vocabFieldInput }}
        >
          <Select.Trigger class="w-[180px]" id="deck">
            <Select.Value
              placeholder="Select the field that is the vocabulary word"
            />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Label>Fields</Select.Label>
              {#each cardFields as field}
                <Select.Item value={field} label={field}>{field}</Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
          <Select.Input name="favoriteFruit" />
        </Select.Root>
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="deck" class="text-right">Definition fields</Label>
        <Popover.Root portal={null}>
          <Popover.Trigger asChild let:builder>
            <Button builders={[builder]} variant="outline">Open</Button>
          </Popover.Trigger>
          <Popover.Content class="w-52">
            {#each cardFields.filter((field) => field !== vocabFieldInput) as field}
              {@const fieldChecked = fieldInput.includes(field)}
              <div class="flex justify-between mb-2">
                <Label for="width">{field}</Label>
                <Checkbox
                  checked={fieldChecked}
                  on:click={() => {
                    if (fieldChecked) {
                      fieldInput = fieldInput.filter((f) => f !== field);
                    } else {
                      fieldInput = [...fieldInput, field];
                    }
                  }}
                />
              </div>
            {/each}
          </Popover.Content>
        </Popover.Root>
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
      <Button
        class="col-span-1"
        on:click={() => (sentencePromptInput = DEFAULT_SENTENCE_PROMPT)}
        >reset sentence prompt to default</Button
      >
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
      on:click={() => (storyPromptInput = DEFAULT_STORY_PROMPT)}
      >reset story prompt to default</Button
    >
  </Dialog.Content>
</Dialog.Root>
