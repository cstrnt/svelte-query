<script>
  import { query, mutate } from "svelte-query";

  const post = query("data/1", () =>
    fetch("https://my-json-server.typicode.com/typicode/demo/posts/1", {
      headers: { Accept: "application/json" }
    }).then(r => r.json())
  );

  let value = "";
  function send() {
    return fetch("https://my-json-server.typicode.com/typicode/demo/posts/1", {
      method: "PATCH",
      body: JSON.stringify({
        title: value
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(r => r.json());
  }
</script>

<h1>Page A</h1>
<input bind:value />
<button on:click={() => mutate('data/1', send)}>SEND</button>

{#if $post.loading}
  Loading...
{:else if $post.error}
  Oh no! {$post.error.message}
{:else}
  <pre>{JSON.stringify($post.data, null, 2)}</pre>
{/if}
