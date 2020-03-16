<script>
  import { query, mutate } from "../../../dist/";
  let value = "";
  let shouldFetch = false;

  $: post = query(
    // new Promise((res, _) => {
    //   setTimeout(() => res("posts/1"), 3000);
    // })
    () => "posts/1"
  );

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
<button on:click={() => mutate('posts/1', send)}>SEND</button>
<button on:click={() => (shouldFetch = true)}>Fetch it baby</button>
<br />

{#if $post.data}
  {#if $post.loading}
    Loading...
  {:else if $post.error}
    Oh no! {$post.error.message}
  {:else}
    <pre>{JSON.stringify($post.data, null, 2)}</pre>
  {/if}
{:else}
  <h1>YIIKES</h1>
{/if}
