<script lang="ts">
  import searchIcon from "$lib/assets/Search.svg";
  import closeIcon from "$lib/assets/close.svg";

  let query = $state("");

  function handleSearch() {
    if (query.trim()) {
      //
    }
  }
</script>

<div
  class=" flex items-center content-center gap-2.5 rounded-4xl my-2 py-2 px-4 max-w-fit mx-auto outline-2 outline-[#7B7B7B] hidden"
>
  <div class="flex items-center content-center flex-row w-xs gap-2.5 max-w-fit">
    <input
      class="border-none px-4 py-2 outline-none hidden"
      type="search"
      bind:value={query}
      placeholder="Pretrazite..."
    />
    <img
      class="cursor-pointer"
      src={searchIcon}
      alt="icon of a magnifying glass"
    />
    <img class="cursor-pointer hidden" src={closeIcon} alt="icon of a cross" />
  </div>
</div>
