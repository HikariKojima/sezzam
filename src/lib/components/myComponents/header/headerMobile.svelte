<script lang="ts">
  import { type Products, type CartProducts } from "$lib/server/db/schema";
  import SearchBar from "./headerComponents/searchBar.svelte";
  import { Truck } from "@lucide/svelte";
  import { Phone } from "@lucide/svelte";

  let cartItems = $state<CartProducts[]>([]);
  let itemsInCart = $state<Products[]>([]);
  let cartTotal = $state<string>("0.00");

  async function getItems(product: CartProducts) {
    try {
      const response = await fetch(`/api/products?id=${product.productId}`);
      if (!response.ok) {
        Error("Failed to fetch item");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("error while fetching", error);
      return null;
    }
  }

  async function getCart() {
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) {
        throw new Error("Unable to fetch cart");
      }
      const data = await response.json();
      cartItems = data.items;
      cartTotal = data.cart?.totalAmount || "0.00";

      const productPromises = cartItems.map((item) => getItems(item));
      const products = await Promise.all(productPromises);
      itemsInCart = products.filter((product) => product !== null);
    } catch (error) {
      console.error("Error fetching cart: ", error);
    }
  }

  $effect(() => {
    getCart();
  });
</script>

<nav
  class="flex items-center justify-between p-8 text-white lg:bg-white lg:text-black lg:py-4 px-12"
>
  <a class="text-xl min-w-[100px]" href="#">Sezzam</a>
  <div class="flex-1 mx-4 lg:mx-8">
    <SearchBar />
  </div>
  <div class="flex items-center justify-center gap-2">
    <div class="phone flex items-center justify-center gap-2">
      <Phone class="hidden md:block" />
      <a
        class="cursor-pointer hover:text-[#EC5800] duration-100 ease-in hidden md:block"
        href="tel:061069798">061/069-798</a
      >
    </div>
    <div class="basket-cnt flex items-center justify-center flex-row gap-1.5">
      <p>Korpa</p>
      <div class="flex items-center justify-center">
        <Truck class="text-[rgb(236,88,0)]" />
        {#if cartItems.length}
          <span class="font-bold"
            >{cartItems.length} <span>{cartTotal}</span></span
          >
        {/if}
      </div>
    </div>
  </div>
</nav>
infoo
{#each itemsInCart as item, i}
  {item.name}
{/each}
