<script>
  let { initialCount = 0 } = $props();
  let count = $state(initialCount);

  $effect(() => {
    count = initialCount;
  });

  function increment() {
    count += 1;
  }

  function decrement() {
    count -= 1;
  }

  function reset() {
    count = 0;
  }
</script>

<div class="p-4 bg-white rounded-lg shadow-md max-w-sm">
  <h2 class="text-xl font-bold text-gray-800 mb-4">Counter</h2>

  <div class="text-center">
    <div class="text-3xl font-bold text-blue-600 mb-4">{count}</div>

    <div class="flex gap-2 justify-center">
      <button
        onclick={decrement}
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        -
      </button>

      <button
        onclick={reset}
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
      >
        Reset
      </button>

      <button
        onclick={increment}
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        +
      </button>
    </div>
  </div>
</div>