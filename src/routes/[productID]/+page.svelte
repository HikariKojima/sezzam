<script lang="ts">
  import { Plus, Minus, ShoppingCart } from "@lucide/svelte";
  import { DateRangeField } from "bits-ui";
  let { data } = $props();
  console.log(data);

  let quantity = 1;

  function updateQuantity(change: number) {
    quantity = Math.max(1, quantity + change);
  }

  //   async function addToCart() {
  //     try {
  //         const response = await fetch('/api/cart' , {
  //             method: 'POST',
  //             headers: {
  //                 'Content-Type': 'application/json'
  //             },
  //             body: JSON.stringify({
  //                 productId: data,
  //                 quantity,
  //                 price: data.price
  //             })
  //         })
  //     }
  //   }
</script>
