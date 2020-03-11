<script>
  import { swr } from "../../../dist/swr";
  const post = swr("data/2", () =>
    fetch("https://my-json-server.typicode.com/typicode/demo/posts/2", {
      headers: { Accept: "application/json" }
    }).then(r => r.json())
  );
</script>

<h1>Page B</h1>
{#if $post.loading}
  Loading...
{:else if $post.error}
  Oh no! {$post.error.message}
{:else}
  <pre>{JSON.stringify($post.data, null, 2)}</pre>
{/if}
