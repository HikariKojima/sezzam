<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<p>Aktuelne Akcije</p>
<Carousel.Root
  class=" w-full max-w-sm"
  opts={{
    loop: true,
    align: "start",
  }}
>
  <Carousel.Content class="-ml-1">
    {#each Array(5) as _, i (i)}
      <Carousel.Item class="md:basis-1/2 lg:basis-1/3 pl-1 md:pl-4">
        <Card.Root>
          <Card.Content
            class="flex aspect-square items-center justify-center p-6"
          >
            <span>{i + 1}</span>
          </Card.Content>
        </Card.Root>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
