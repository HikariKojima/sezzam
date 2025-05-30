<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Plus, Minus } from "@lucide/svelte";
  import { cartItems, cartTotal, itemsInCart } from "$lib/stores/cart.state";

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

  // Use $state instead of $derived for mutable state
  let quantities = $state(new Map<number, number>());
  let btnState = $state(new Map<number, boolean>());

  async function refreshCart() {
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("fetch failed");
      const data = await response.json();
      cartItems.set(data.items);
      cartTotal.set(data.cart?.totalAmount || "0.00");

      // Fetch product details for each cart item
      const productPromises = data.items.map((item: { productId: any }) =>
        fetch(`/api/products?id=${item.productId}`).then((res) => res.json())
      );
      const productDetails = await Promise.all(productPromises);
      itemsInCart.set(productDetails.filter(Boolean));

      // Update local UI state - create new Maps to trigger reactivity
      const newBtnState = new Map<number, boolean>();
      const newQuantities = new Map<number, number>();

      data.items.forEach((item: { productId: number; quantity: number }) => {
        newBtnState.set(item.productId, false);
        newQuantities.set(item.productId, item.quantity);
      });

      products.forEach((product) => {
        if (!newBtnState.has(product.id)) {
          newBtnState.set(product.id, true);
          newQuantities.set(product.id, 1);
        }
      });

      btnState = newBtnState;
      quantities = newQuantities;
    } catch (error) {
      console.error("error fetching cart: ", error);
    }
  }

  async function addToCart(product: { id: number; price: number }) {
    // Optimistically update UI
    const newBtnState = new Map(btnState);
    const newQuantities = new Map(quantities);

    newBtnState.set(product.id, false);
    newQuantities.set(product.id, 1);

    btnState = newBtnState;
    quantities = newQuantities;

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          price: product.price,
        }),
      });
      if (!response.ok) throw new Error("failed to add to cart");
      await refreshCart();
    } catch (error) {
      // Rollback UI if backend fails
      const rollbackBtnState = new Map(btnState);
      const rollbackQuantities = new Map(quantities);

      rollbackBtnState.set(product.id, true);
      rollbackQuantities.delete(product.id);

      btnState = rollbackBtnState;
      quantities = rollbackQuantities;
      console.error("Failed to add to cart", error);
    }
  }

  async function updateQuantity(productId: number, change: number) {
    const currentQty = quantities.get(productId) || 1;
    const newQty = currentQty + change;
    if (newQty < 0) return;

    if (newQty === 0) {
      // Optimistically update UI
      const newBtnState = new Map(btnState);
      const newQuantities = new Map(quantities);

      newBtnState.set(productId, true);
      newQuantities.set(productId, 1);

      btnState = newBtnState;
      quantities = newQuantities;

      try {
        await deleteFromCart(productId);
        await refreshCart();
      } catch (error) {
        // Rollback UI if backend fails
        const rollbackBtnState = new Map(btnState);
        rollbackBtnState.set(productId, false);
        btnState = rollbackBtnState;
        console.error("Failed to delete from cart", error);
      }
      return;
    }

    // Optimistically update UI
    const newQuantities = new Map(quantities);
    newQuantities.set(productId, newQty);
    quantities = newQuantities;

    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQty }),
      });
      if (!response.ok) throw new Error("failed to update quantity");
      await refreshCart();
    } catch (error) {
      // Rollback UI if backend fails
      const rollbackQuantities = new Map(quantities);
      rollbackQuantities.set(productId, currentQty);
      quantities = rollbackQuantities;
      console.error("Failed to update quantity", error);
    }
  }

  async function deleteFromCart(productId: number) {
    const response = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 0 }),
    });
    if (!response.ok) throw new Error("failed to delete from cart");
  }

  $effect(() => {
    refreshCart();
  });
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
                    src={product.thumbnail || "/placeholder.svg"}
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
              {:else}
                <div class="flex items-center justify-center gap-2">
                  <Button
                    class="w-2.5"
                    onclick={() => updateQuantity(product.id, -1)}
                  >
                    <Minus></Minus>
                  </Button>
                  <span>{quantities.get(product.id) || 1}</span>
                  <Button
                    class="w-2.5"
                    onclick={() => updateQuantity(product.id, 1)}
                  >
                    <Plus></Plus>
                  </Button>
                </div>
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
