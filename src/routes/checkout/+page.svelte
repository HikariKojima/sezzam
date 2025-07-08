<script lang="ts">
  import {
    cartItems,
    cartTotal,
    itemsInCart,
    refreshCart,
  } from "$lib/stores/cart.state";
  console.log(cartItems);
  import { type Products, type CartProducts } from "$lib/server/db/schema";
  function getQuantity(item: Products, cartItemsArr: CartProducts[]): any {
    const cartEntry = cartItemsArr.find((ci) => ci.productId === item.id);
    const quantity = cartEntry?.quantity || 1;
    const price = Number(item.price);
    const total = quantity * price;
    return `${quantity}`;
  }

  $effect(() => {
    refreshCart();
  });

  let address = $state("");
  let phoneNumber = $state("");
  let notes = $state("");

  let message = $state("");
  let isLoading = $state(false);

  async function placeOrder(event: { preventDefault: () => void }) {
    event.preventDefault();
    isLoading = true;

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          address,
          notes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        message = data.error;
      } else {
        message = "Narudzba je uspjesno poslana";
        refreshCart();
      }
    } catch (err) {
      console.log("There was a problem with the order");
    } finally {
      isLoading = false;
    }
  }
</script>

<h1>Artikli</h1>
<div>
  {#if $itemsInCart.length === 0}
    Vasa korpa je prazna
  {:else}
    <table>
      <thead>
        <tr>
          <th>Naziv Artikla</th>
          <th>Kolicina</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {#each $itemsInCart as item}
          <tr>
            <td>{item.name}</td>
            <td>{getQuantity(item, $cartItems)}</td>
            <td>{getQuantity(item, $cartItems) * Number(item.price)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <div>
      <form onsubmit={placeOrder}>
        <input
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          placeholder="061/241/321"
          bind:value={phoneNumber}
          required
        />
        <input
          type="text"
          name="address"
          id="address"
          placeholder="Jahileja Fincija 9"
          bind:value={address}
          required
        />

        <input
          type="text"
          name="notes"
          id="notes"
          placeholder="Prvi sprat plava zgrada"
          bind:value={notes}
        />
        <button type="submit" disabled={isLoading}
          >{isLoading ? "SLanje..." : "Naruci"}</button
        >
      </form>
    </div>
  {/if}
</div>
