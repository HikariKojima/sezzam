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
  class="gap-2.5 rounded-3xl my-2 py-2 px-2 mx-auto outline-2 outline-[#7B7B7B]"
>
  <div class="flex items-center justify-between flex-row max-w-fit">
    <input
      class="border-none px-4 py-2 outline-none hidden"
      type="search"
      bind:value={query}
      placeholder="Pretrazite..."
    />
    <img
      class="cursor-pointer mr-8"
      src={searchIcon}
      alt="icon of a magnifying glass"
    />
    <img class="cursor-pointer hidden" src={closeIcon} alt="icon of a cross" />
  </div>
</div>
