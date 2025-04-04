<script lang="ts">
  import HeaderMobile from "$lib/components/myComponents/header/headerMobile.svelte";
  import moreThan from "$lib/components/myComponents/header/moreThan.svg";
</script>

<HeaderMobile></HeaderMobile>

<main>
  <section class="hero">
    <h1>Uštedite do 30% na odabrane artikle</h1>
    <button class="cta"><a href="#">Odabrani artikli</a></button>
  </section>

  <section>
    <h2>Aktuelne Akcije</h2>
    <img src={moreThan} alt="an arrow icon" />
    <div class="card-container">
      <div class="card">
        <img src="" alt="" />
        <p></p>
        <p class="old-price"></p>
        <p class="new-price"></p>
      </div>
    </div>
    <img src={moreThan} alt="an arrow icon" />
  </section>
</main>
