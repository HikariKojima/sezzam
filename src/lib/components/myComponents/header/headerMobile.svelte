<script lang="ts">
  import SearchBar from "./headerComponents/searchBar.svelte";
  import { Truck } from "@lucide/svelte";
  import { Phone } from "@lucide/svelte";
</script>

<nav
  class="flex items-center justify-between p-8 text-white lg:bg-white lg:text-black lg:py-4 px-12"
>
  <a class="text-xl min-w-[100px]" href="#">Sezzam</a>
  <div class="flex-1 mx-4 lg:mx-8">
    <SearchBar />
  </div>
  <div class="flex items-center justify-center gap-2">
    <div class="phone flex items-center justify-center gap-2">
      <Phone class="hidden md:block" />
      <a
        class="cursor-pointer hover:text-[#EC5800] duration-100 ease-in hidden md:block"
        href="tel:061069798">061/069-798</a
      >
    </div>
    <div class="basket-cnt flex items-center justify-center flex-row gap-1.5">
      <p>Korpa</p>
      <div class="flex items-center justify-center">
        <Truck class="text-[rgb(236,88,0)]" />
        <span class="font-bold pl-2">1</span>
      </div>
    </div>
  </div>
</nav>
