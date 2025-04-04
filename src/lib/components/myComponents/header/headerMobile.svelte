<script lang="ts">
  import SearchBarMobile from "./headerComponents/searchBarMobile.svelte";
</script>

<header>
  <nav>
    <a href="#">Sezzam</a>
    <SearchBarMobile></SearchBarMobile>
    <div class="basket">
      <p>Korpa</p>
      <div class="basket-cnt">
        <img src="$lib/assets/Truck.svg" alt="icon of a truck" />
        <span>1</span>
      </div>
    </div>
  </nav>
</header>
