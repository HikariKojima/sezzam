<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  export let products: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    weight: number;
    thumbnail: string;
  }>;
</script>

<h2 class="font-bold text-2xl text-center mb-4">Aktuelne Akcije</h2>
<Carousel.Root
  class=" w-full max-w-sm md:max-w-3xl mx-auto "
  opts={{
    loop: true,
    align: "start",
  }}
>
  <Carousel.Content class="-ml-4">
    {#each products as product (product.id)}
      <Carousel.Item
        class="pl-4 basis-full sm-basis-1/2 md:basis-1/3 lg:basis-1/4"
      >
        <Card.Root class="h-full flex flex-col">
          <Card.Header class="flex-1">
            <div class="aspect-video overflow-hidden">
              <img
                class="w-full h-full object-cover"
                src={product.thumbnail}
                alt={product.description}
              />
            </div>
            <Card.Title class="mt-4 line-clamp-2">{product.title}</Card.Title>
            <Card.Description>{product.title}</Card.Description>
          </Card.Header>
          <Card.Content class="mt-auto p-4">
            <div class="flex items-center content-center flex-col p-1">
              <p class="text-red-500 font-bold text-2xl">
                {product.price}km/m2
              </p>
              <p class="line-through">{product.price}km/m2</p>
            </div>
          </Card.Content>
        </Card.Root>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
