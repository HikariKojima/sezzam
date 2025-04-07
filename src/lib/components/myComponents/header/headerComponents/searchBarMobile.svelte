<script lang="ts">
  import { Search } from "@lucide/svelte";
  import { X } from "@lucide/svelte";

  let isActive = $state(false);
  let query = $state("");

  function handleSearch() {
    if (query.trim()) {
      //
    }
  }
</script>

<div class="w-full flex justify-end md:block">
  {#if !isActive}
    <button
      onclick={() => (isActive = true)}
      class="md:hidden py-2"
      aria-label="Open search bar"
    >
      <Search class="cursor-pointer  stroke-current" />
    </button>
  {/if}
  <div
    class:flex={isActive}
    class:hidden={!isActive}
    class="gap-2.5 rounded-3xl my-2 py-2 px-2 mx-auto outline-2 outline-[#7B7B7B] items-center w-full md:flex max-w-7xl"
  >
    <div class="flex items-center md:justify-between w-full">
      <input
        class="border-none px-4 py-2 outline-none flex-1"
        type="search"
        bind:value={query}
        placeholder="Pretrazite..."
        onblur={() => (isActive = false)}
      />
      {#if isActive}
        <X
          class="cursor-pointer mr-2"
          onclick={() => {
            isActive = false;
            query = "";
          }}
        />
      {/if}
      <Search class="cursor-pointer  stroke-current mr-4 hidden md:block" />
    </div>
  </div>
</div>
