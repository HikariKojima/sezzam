<script lang="ts">
  import SearchBarMobile from "./headerComponents/searchBarMobile.svelte";
  import truckIcon from "$lib/assets/Truck.svg";
</script>

<header>
  <nav>
    <a href="#">Sezzam</a>
    <SearchBarMobile></SearchBarMobile>
    <div class="basket">
      <p>Korpa</p>
      <div class="basket-cnt">
        <img src={truckIcon} alt="icon of a truck" />
        <span>1</span>
      </div>
    </div>
  </nav>
</header>
