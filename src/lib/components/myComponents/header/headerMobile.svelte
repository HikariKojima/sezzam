<script lang="ts">
  import { cartItems, cartTotal, itemsInCart } from "$lib/stores/cart.state";
  import { type Products, type CartProducts } from "$lib/server/db/schema";
  import SearchBar from "./headerComponents/searchBar.svelte";
  import { Truck } from "@lucide/svelte";
  import { Phone } from "@lucide/svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import DropdownMenuContent from "$lib/components/ui/dropdown-menu/dropdown-menu-content.svelte";
  import DropdownMenuGroup from "$lib/components/ui/dropdown-menu/dropdown-menu-group.svelte";

  function cartEntryDisplay(item: Products, cartItemsArr: CartProducts[]) {
    const cartEntry = cartItemsArr.find((ci) => ci.productId === item.id);
    const quantity = cartEntry?.quantity || 1;
    const price = Number(item.price);
    const total = quantity * price;
    return `${item.name} - ${quantity} x ${price} KM = ${total} KM`;
  }
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

    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div
          class="basket-cnt flex items-center justify-center flex-row gap-1.5"
        >
          <p>Korpa</p>
          <Truck class="text-[rgb(236,88,0)]" />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          {#if $itemsInCart.length === 0}
            <DropdownMenu.Item>Vasa korpa je prazna</DropdownMenu.Item>
          {:else}
            {#each $itemsInCart as item}
              <DropdownMenu.Item>
                {cartEntryDisplay(item, $cartItems)}
              </DropdownMenu.Item>
            {/each}
          {/if}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</nav>
