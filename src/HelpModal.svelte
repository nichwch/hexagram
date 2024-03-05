<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
</script>

<Dialog.Root>
  <Dialog.Trigger asChild let:builder>
    <Button
      class="rounded-none float-right"
      variant="ghost"
      builders={[builder]}>help</Button
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
        "webCorsOriginList" to include "tauri://localhost".
      </p>
    </div>
  </Dialog.Content>
</Dialog.Root>
