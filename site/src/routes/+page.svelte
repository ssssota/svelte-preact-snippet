<script lang="ts">
  import {page} from '$lib';
  let name = $state('preact');
</script>

<pre>↓↓preact based snippet↓↓</pre>
{@render page('svelte-preact-snippet', `Hello ${name}!`)}
<pre>↑↑preact based snippet↑↑</pre>

<input type="text" bind:value={name} />
