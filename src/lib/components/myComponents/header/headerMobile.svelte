<script lang="ts">
  import SearchBarMobile from "./headerComponents/searchBarMobile.svelte";
  import truckIcon from "$lib/assets/Truck.svg";
</script>

<nav class="flex items-center justify-between p-8 text-white">
  <a class="text-xl" href="#">Sezzam</a>
  <div>
    <SearchBarMobile></SearchBarMobile>
    <div class="basket-cnt flex items-center justify-center flex-row gap-2">
      <p>Korpa</p>
      <div class="flex items-center justify-center">
        <img src={truckIcon} alt="icon of a truck" />
        <span class="font-bold">1</span>
      </div>
    </div>
  </div>
</nav>
