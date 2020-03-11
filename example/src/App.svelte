<script>
  import Page1 from "./components/Page1.svelte";
  import Page2 from "./components/Page2.svelte";
  let current = false;
</script>

{#if current}
  <Page1 />
{:else}
  <Page2 />
{/if}
<br />
<button on:click={() => (current = !current)}>SWITCH</button>
