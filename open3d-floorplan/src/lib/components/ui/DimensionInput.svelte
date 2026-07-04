<script lang="ts">
  interface Props {
    x: number;
    y: number;
    onCommit: (valueMm: number) => void;
    onCancel: () => void;
  }

  let { x, y, onCommit, onCancel }: Props = $props();
  let value = $state('');

  function submit() {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed) && parsed > 0) onCommit(parsed);
  }
</script>

<div
  class="absolute z-30 -translate-x-1/2 -translate-y-full rounded-lg border border-gray-300 bg-white px-2 py-2 shadow-lg"
  style="left: {x}px; top: {y}px;"
  role="dialog"
  aria-label="Dimension input"
  onclick={(e) => e.stopPropagation()}
>
  <div class="flex items-center gap-2">
    <input
      class="h-8 w-24 rounded border border-gray-300 px-2 text-sm outline-none focus:border-blue-500"
      type="number"
      min="1"
      step="1"
      bind:value
      placeholder="mm"
      onkeydown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submit();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        }
      }}
      autofocus
      aria-label="Wall length in millimeters"
    />
    <button
      type="button"
      class="rounded bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
      onclick={submit}
    >
      OK
    </button>
    <button
      type="button"
      class="rounded border border-gray-300 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
      onclick={onCancel}
    >
      Cancel
    </button>
  </div>
</div>
