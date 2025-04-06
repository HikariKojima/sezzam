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

<header
  class="bg-[rgba(0,0,0,0.5)] bg-[url($lib/assets/hero.png)] bg-no-repeat bg-cover bg-blend-soft-light min-h-[70vh]"
>
  <HeaderMobile></HeaderMobile>

  <section class="hero flex items-center justify-center flex-col">
    <h1
      class="text-center text-2xl font-semibold mb-6 text-white mt-[20vh] px-6"
    >
      Uštedite do 30% na odabrane artikle
    </h1>
    <button class="cta mb-12 py-4 px-8 bg-[#EC5800] text-white"
      ><a href="#">Odabrani artikli</a></button
    >
  </section>
</header>
<main>
  <div class="mx-auto">
    <ActionCarousel products={data.products}></ActionCarousel>
  </div>
  <CategoryCarousel {categories}></CategoryCarousel>
</main>
