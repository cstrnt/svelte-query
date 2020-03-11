<script>
  import AAAA from "./components/Abc.svelte";
  import BBBB from "./components/Bcd.svelte";
  let current = false;
</script>

{#if current}
  <AAAA />
{:else}
  <BBBB />
{/if}
<br />
<button on:click={() => (current = !current)}>SWITCH</button>
