<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Plus, Minus, ShoppingCart } from "@lucide/svelte";

  const { products } = $props<{
    products: Array<{
      id: number;
      title: string;
      description: string;
      category: string;
      price: number;
      weight: number;
      thumbnail: string;
    }>;
  }>();

  let quantities = $derived(new Map<number, number>());
  let btnState = $derived(new Map<number, boolean>());

  if (products) {
    products.forEach((product: { id: number }) => {
      if (!btnState.has(product.id)) {
        btnState.set(product.id, true);
      }
    });
  }

  function updateQuantity(productId: number, change: number) {
    const currentQty = quantities.get(productId) || 1;
    const newQty = Math.max(1, currentQty + change);
    quantities.set(productId, newQty);
  }

  async function addToCart(product: { id: number; price: number }) {
    try {
      const quantity = quantities.get(product.id) || 1;
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          price: product.price,
        }),
      });
      if (!response.ok) {
        console.log(btnState.get(product.id));
        btnState.set(product.id, false);
        btnState = new Map(btnState);
        console.log(btnState);
        throw new Error("failed to add to cart");
      }
      quantities.set(product.id, 1);
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  }
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
        <div class="relative product-container">
          <Card.Root class="h-full flex flex-col">
            <Card.Header>
              <a class="cursor-pointer" href="/products/{product.id}">
                <div class="aspect-square overflow-hidden relative">
                  <img
                    class="w-full h-full object-cover"
                    src={product.thumbnail}
                    alt={product.description}
                  />

                  <Card.Title class="mt-4 line-clamp-2 text-xl"
                    >{product.title}</Card.Title
                  >
                  <Card.Description>{product.title}</Card.Description>
                </div>
              </a>
            </Card.Header>
            <Card.Content>
              <div class="flex items-center justify-center flex-col">
                <p class="text-red-500 font-bold text-xl">
                  {product.price}km/m2
                </p>
                <p class="line-through">{product.price}km/m2</p>
              </div>
              {#if btnState.get(product.id)}
                <Button
                  class="cursor-pointer"
                  onclick={() => addToCart(product)}>Dodaj u korpu</Button
                >
              {/if}
            </Card.Content>
          </Card.Root>
        </div>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>

<style>
</style>
