<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import * as Card from "$lib/components/ui/card/index.js";

  export let categories: Array<{
    id: number;
    img: string;
    name: string;
  }>;
</script>

<h2 class="font-bold text-2xl text-center mb-10">Pogledajte Kategorije</h2>

<Carousel.Root
  class=" w-full max-w-sm md:max-w-3xl mx-auto "
  opts={{
    loop: true,
    align: "start",
  }}
>
  <Carousel.Content class="-ml-4">
    {#each categories as category (category.id)}
      <Carousel.Item class="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
        <a class="cursor-pointer" href="#">
          <Card.Root class="h-full flex flex-col">
            <Card.Header class="flex-1">
              <div class="aspect-square overflow-hidden bg-black">
                <img
                  class="w-full h-full object-cover"
                  src={category.img}
                  alt={category.name}
                />
              </div>
              <Card.Title class="my-4 line-clamp-2 ">{category.name}</Card.Title
              >
            </Card.Header>
          </Card.Root>
        </a>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
