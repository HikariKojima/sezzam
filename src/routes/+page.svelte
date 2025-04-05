<script lang="ts">
  import HeaderMobile from "$lib/components/myComponents/header/headerMobile.svelte";
  import ActionCarousel from "$lib/components/myComponents/ActionProducts/productsOnAction.svelte";

  export let data;
</script>

<HeaderMobile></HeaderMobile>

<main>
  <section class="hero">
    <h1>Uštedite do 30% na odabrane artikle</h1>
    <button class="cta"><a href="#">Odabrani artikli</a></button>
  </section>
  <div class="mx-auto ml-12">
    <ActionCarousel products={data.products}></ActionCarousel>
  </div>
</main>
