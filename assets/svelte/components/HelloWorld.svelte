<script>
  let { name = 'World' } = $props();
</script>

<main class="h-full flex flex-col justify-center p-4">
  <h1 class="text-lg font-bold text-red-500">Hello, {name}!</h1>
  <p class="mt-2 text-gray-400 text-sm">This is a Svelte component integrated with Arizona framework.</p>
</main>
