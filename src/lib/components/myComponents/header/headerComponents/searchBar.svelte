<script lang="ts">
  import { Search } from "@lucide/svelte";
  import { X } from "@lucide/svelte";
  import debounce from "lodash/debounce";
  import type { Products } from "$lib/server/db/schema";

  let searchQuery = $state("");
  let searchResults = $state<Products[]>([]);
  let isLoading = $state(false);
  let showResults = $state(false);
  let isActive = $state(false);

  const isValidQuery = $derived(searchQuery.length >= 2);

  $effect(() => {
    if (!isValidQuery) {
      searchResults = [];
      return;
    }
    searchProducts(searchQuery);
  });

  const searchProducts = debounce(async (query: string) => {
    isLoading = true;
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        searchResults = await response.json();
        showResults = true;
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      isLoading = false;
    }
  }, 300);

  function handleBlur() {
    setTimeout(() => {
      showResults = false;
    }, 200);
  }

  function clearSearch() {
    searchQuery = "";
    isActive = false;
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
        bind:value={searchQuery}
        placeholder="Pretrazite..."
        onblur={handleBlur}
      />
      {#if isActive}
        <X class="cursor-pointer mr-2" onclick={clearSearch} />
      {/if}
      <Search class="cursor-pointer  stroke-current mr-4 hidden md:block" />
    </div>
    {#if showResults && isValidQuery}
      <div
        class="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg mt-1"
      >
        {#if searchResults.length > 0}
          {#each searchResults as product}
            <a
              href="/products/{product.id}"
              class="block px-4 py-2 hover:bg-gray-100"
            >
              <div class="font-medium">{product.name}</div>
              <div class="text-sm text-gray-600">${product.price}</div>
            </a>
          {/each}
        {:else}
          <div class="px-4 py-2 text-gray-500">No results found</div>
        {/if}
      </div>
    {/if}
  </div>
</div>
