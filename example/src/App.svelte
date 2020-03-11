<script>
  import { setConfig } from "svelte-query";
  import Page1 from "./components/Page1.svelte";
  import Page2 from "./components/Page2.svelte";
  let current = false;
  setConfig({
    fetcher: (url, ...args) => {
      return fetch(
        `https://my-json-server.typicode.com/typicode/demo/${url}`,
        ...args
      ).then(r => r.json());
    }
  });
</script>

{#if current}
  <Page1 />
{:else}
  <Page2 />
{/if}
<br />
<button on:click={() => (current = !current)}>SWITCH</button>
