<script lang="ts">
  import ActionCarousel from "$lib/components/myComponents/Carousel/productsOnAction.svelte";
  import CategoryCarousel from "$lib/components/myComponents/Carousel/categoryCarousel.svelte";
  import Tile from "$lib/assets/Tiles.svg";
  import Floor from "$lib/assets/WoodenFloor.svg";
  import Footer from "$lib/components/myComponents/footer/footer.svelte";
  let { data } = $props();
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

<main>
  <div
    class="bg-[rgba(0,0,0,0.5)] bg-[url($lib/assets/hero.svg)] bg-no-repeat bg-cover bg-blend-soft-light min-h-[70vh] mb-12"
  >
    <section class="hero flex items-center justify-center flex-col">
      <h1 class="text-center text-2xl mb-12 text-white mt-[20vh] px-6">
        Uštedite do 30% na odabrane artikle
      </h1>
      <button
        class="cta py-4 px-8 bg-[#EC5800] text-white hover:bg-[#BF4700] ease-in duration-100 rounded-md"
        ><a class="font-semibold" href="#">Odabrani artikli</a></button
      >
    </section>
  </div>
  <div class="mx-auto">
    <ActionCarousel products={data.products}></ActionCarousel>
  </div>
  <CategoryCarousel {categories}></CategoryCarousel>
</main>
<Footer></Footer>
