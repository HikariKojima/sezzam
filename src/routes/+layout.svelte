<script lang="ts">
  import HeaderMobile from "$lib/components/myComponents/header/headerMobile.svelte";
  import "../app.css";

  let { children } = $props();
</script>

<header>
  <HeaderMobile></HeaderMobile>
</header>
{@render children()}
