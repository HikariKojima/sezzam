<script lang="ts">
  import HeaderMobile from "$lib/components/myComponents/header/headerMobile.svelte";
  import ActionCarousel from "$lib/components/myComponents/Carousel/productsOnAction.svelte";
  import CategoryCarousel from "$lib/components/myComponents/Carousel/categoryCarousel.svelte";
  import Tile from "$lib/assets/Tiles.svg";
  import Floor from "$lib/assets/WoodenFloor.svg";
  export let data;

  const categories = [
    {
      id: 1,
      img: Tile,
      name: "Zidne Plocice",
    },

    {
      id: 2,
      img: Tile,
      name: "Podne Plocice",
    },
    {
      id: 3,
      img: Floor,
      name: "Podovi",
    },
  ];
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
  <CategoryCarousel {categories}></CategoryCarousel>
</main>
