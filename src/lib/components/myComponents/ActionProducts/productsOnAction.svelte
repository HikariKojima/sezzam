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

<p>Pogledajte Kategorije</p>
<Carousel.Root
  class="w-full max-w-md"
  opts={{
    loop: true,
    align: "start",
  }}
>
  <Carousel.Content class="-ml-1">
    {#each products as product (product.id)}
      <Carousel.Item class="md:basis-1/2 pl-1 md:pl-4 basis-1/3">
        <Card.Root>
          <Card.Header>
            <img src={product.thumbnail} alt={product.description} />
            <Card.Title class="mb-4">{product.title}</Card.Title>
            <Card.Description>{product.title}</Card.Description>
          </Card.Header>
          <Card.Content
            class="flex aspect-square items-center justify-center p-6"
          >
            <div class="flex items-center content-center flex-col">
              <p class="text-red-500 font-poppins">{product.price}km/m2</p>
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
