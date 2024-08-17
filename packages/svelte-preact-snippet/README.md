# svelte-preact-snippet

You can create svelte snippets with JSX syntax based on preact.

## Usage

```sh
npm i svelte-preact-snippet preact
```

tsconfig.json

```jsonc
{
  "compilerOptions": {
    // ...
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  }
}
```

snippet.tsx

```tsx
export const snippet = createSnippet<[string, string]>((title, content) => (
  <div>
    <header>
      <h1>{title()}</h1>
    </header>
    <p>{content()}</p>

    <button onClick={() => alert('Clicked!\n' + content())}>Click me</button>
  </div>
));
```

App.svelte

```svelte
<script lang="ts">
  import {page} from '$lib';
  let name = $state('preact');
</script>
{@render page('svelte-preact-snippet', `Hello ${name}!`)}
<input type="text" bind:value={name} />
```

→ **[Demo](https://ssssota.github.io/svelte-preact-snippet/)**

## License

MIT
