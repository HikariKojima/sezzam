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

<h2 class="font-bold text-3xl text-center mb-6 mt-2">Aktuelne Akcije</h2>
<Carousel.Root
  class=" w-full max-w-sm md:max-w-3xl mx-auto "
  opts={{
    loop: true,
    align: "start",
  }}
>
  <Carousel.Content class="-ml-4 mb-12">
    {#each products as product (product.id)}
      <Carousel.Item
        class="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
      >
        <a class="cursor-pointer" href="#">
          <Card.Root class="h-full flex flex-col">
            <Card.Header>
              <div class="aspect-square overflow-hidden">
                <img
                  class="w-full h-full object-cover"
                  src={product.thumbnail}
                  alt={product.description}
                />
              </div>
              <Card.Title class="mt-4 line-clamp-2 text-xl"
                >{product.title}</Card.Title
              >
              <Card.Description>{product.title}</Card.Description>
            </Card.Header>
            <Card.Content class="">
              <div class="flex items-center justify-center flex-col">
                <p class="text-red-500 font-bold text-xl">
                  {product.price}km/m2
                </p>
                <p class="line-through">{product.price}km/m2</p>
              </div>
            </Card.Content>
          </Card.Root>
        </a>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
