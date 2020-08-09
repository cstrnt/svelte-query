<script>
  import { query, mutate } from "../../../dist/";
  let value = "";
  let shouldFetch = false;

  const { data: post, refetch } = query(
    new Promise((res, _) => {
      setTimeout(() => res("posts/1"), 3000);
    })
  );

  function send() {
    return fetch("https://my-json-server.typicode.com/typicode/demo/posts/1", {
      method: "PATCH",
      body: JSON.stringify({
        title: value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((r) => r.json());
  }
</script>

<h1>Page A</h1>
<input bind:value />
<button on:click={() => mutate('posts/1', send)}>SEND</button>
<button on:click={() => refetch()}>Fetch it baby</button>
<br />

{#if $post.loading}
  Loading...
{:else if $post.error}
  Oh no! {$post.error.message}
{:else if $post.data}
  <pre>{JSON.stringify($post.data, null, 2)}</pre>
{/if}
