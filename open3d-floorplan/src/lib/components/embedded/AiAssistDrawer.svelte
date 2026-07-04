<script lang="ts">
  import { get } from 'svelte/store';

  import { browserApiFetch } from '$lib/embed/browserApi';
  import type { Project } from '$lib/models/types';
  import {
    addFurniture,
    beginUndoGroup,
    currentProject,
    endUndoGroup,
    setFurnitureRotation,
    updateFurniture,
  } from '$lib/stores/project';
  import { furnitureCatalog, getCatalogItem } from '$lib/utils/furnitureCatalog';

  let { open = $bindable(false) }: { open: boolean } = $props();

  type Message = { role: 'user' | 'assistant'; content: string };
  type Placement = {
    catalogId: string;
    x: number;
    y: number;
    rotation?: number;
    width?: number;
    depth?: number;
    height?: number;
  };
  type ParsedResponse = {
    message: string;
    placements?: Placement[];
    warnings?: Array<{ message: string; severity?: string }>;
  };

  let prompt = $state('');
  let sending = $state(false);
  let messages = $state<Message[]>([]);
  let pendingSuggestion = $state<ParsedResponse | null>(null);
  let errorMessage = $state('');

  function close() {
    open = false;
  }

  function describeProject(project: Project): string {
    const floor = project.floors.find((entry) => entry.id === project.activeFloorId) ?? project.floors[0];
    const itemCount = project.floors.reduce((count, entry) => count + entry.furniture.length, 0);
    if (!floor) {
      return `Project "${project.name}" has no floors yet.`;
    }

    const bounds = floor.walls.flatMap((wall) => [wall.start, wall.end]);
    const xs = bounds.map((point) => point.x);
    const ys = bounds.map((point) => point.y);
    const width = xs.length > 0 ? Math.max(...xs) - Math.min(...xs) : 600;
    const depth = ys.length > 0 ? Math.max(...ys) - Math.min(...ys) : 800;

    return [
      `Project: ${project.name}`,
      `Active floor: ${floor.name}`,
      `Approx room size: ${Math.round(width * 10)}mm x ${Math.round(depth * 10)}mm`,
      `Walls: ${floor.walls.length}`,
      `Doors: ${floor.doors.length}`,
      `Windows: ${floor.windows.length}`,
      `Furniture: ${itemCount}`,
    ].join('\n');
  }

  function buildCatalogSummary(): string {
    return furnitureCatalog
      .slice(0, 80)
      .map((item) => `${item.id}: ${item.name} (${item.category}, ${item.width}x${item.depth}cm)`)
      .join('\n');
  }

  function parseAssistantResponse(raw: string): ParsedResponse {
    try {
      const parsed = JSON.parse(raw) as ParsedResponse;
      return {
        message: parsed.message || 'Suggestion ready.',
        placements: Array.isArray(parsed.placements) ? parsed.placements : [],
        warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
      };
    } catch {
      return { message: raw };
    }
  }

  async function sendPrompt() {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || sending) return;

    const project = get(currentProject);
    if (!project) return;

    const systemMessage = [
      'You are the AI assist inside an Open3D workspace floor planner.',
      'Respond with JSON only.',
      'Use this schema:',
      '{"message":"short response","placements":[{"catalogId":"existing-id","x":120,"y":80,"rotation":0}],"warnings":[{"message":"optional warning","severity":"warning"}]}',
      'Only use catalogId values from this catalog list.',
      'Coordinates are in planner centimeters, measured from the top-left room origin.',
      'If the request is advisory only, return an empty placements array.',
      'Catalog:',
      buildCatalogSummary(),
    ].join('\n');

    const userMessage = [
      describeProject(project),
      '',
      `User request: ${trimmedPrompt}`,
    ].join('\n');

    const nextMessages = [...messages, { role: 'user' as const, content: trimmedPrompt }];
    messages = nextMessages;
    prompt = '';
    pendingSuggestion = null;
    errorMessage = '';
    sending = true;

    try {
      const response = await browserApiFetch('/api/planner/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessage },
          ],
          context: {
            planner: 'unified',
            projectName: project.name,
            currentShapeCount: project.floors.reduce((count, floor) => count + floor.furniture.length, 0),
          },
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { content?: string; error?: string };
      if (!response.ok) {
        throw new Error(payload.error || `AI request failed (${response.status})`);
      }

      const parsed = parseAssistantResponse(payload.content || 'No response received.');
      pendingSuggestion = parsed;
      messages = [...nextMessages, { role: 'assistant', content: parsed.message }];
    } catch (error: unknown) {
      errorMessage = error instanceof Error ? error.message : 'AI request failed.';
    } finally {
      sending = false;
    }
  }

  function applySuggestion() {
    if (!pendingSuggestion?.placements?.length) return;

    beginUndoGroup();
    for (const placement of pendingSuggestion.placements) {
      const fallback = getCatalogItem(placement.catalogId);
      if (!fallback) continue;

      const nextId = addFurniture(placement.catalogId, {
        x: placement.x,
        y: placement.y,
      });

      if (typeof placement.rotation === 'number') {
        setFurnitureRotation(nextId, placement.rotation);
      }

      if (
        typeof placement.width === 'number'
        || typeof placement.depth === 'number'
        || typeof placement.height === 'number'
      ) {
        updateFurniture(nextId, {
          width: placement.width ?? fallback.width,
          depth: placement.depth ?? fallback.depth,
          height: placement.height ?? fallback.height,
        });
      }
    }
    endUndoGroup('Applied AI suggestion');
    pendingSuggestion = null;
  }
</script>

{#if open}
  <div class="fixed inset-0 z-[80] bg-black/30" onclick={close} onkeydown={(event) => { if (event.key === 'Escape') close(); }} role="dialog" tabindex="-1" aria-label="AI Assist">
    <div class="absolute right-0 top-0 h-full w-full max-w-md border-l border-slate-200 bg-white shadow-2xl" onclick={(event) => event.stopPropagation()} onkeydown={(event) => event.stopPropagation()} role="document">
      <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 class="text-base font-semibold text-slate-800">AI Assist</h2>
          <p class="text-xs text-slate-500">Layout guidance and one-click placement suggestions</p>
        </div>
        <button class="text-slate-400 transition-colors hover:text-slate-600" onclick={close} aria-label="Close AI assist">✕</button>
      </div>

      <div class="flex h-[calc(100%-73px)] flex-col">
        <div class="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {#if messages.length === 0}
            <div class="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Ask for layout ideas, placement help, or plan critique. Example: "Place 8 workstations along the long wall and leave a central aisle."
            </div>
          {:else}
            {#each messages as message}
              <div class="rounded-xl px-4 py-3 text-sm {message.role === 'user' ? 'ml-8 bg-slate-800 text-white' : 'mr-8 border border-slate-200 bg-slate-50 text-slate-700'}">
                {message.content}
              </div>
            {/each}
          {/if}

          {#if errorMessage}
            <div class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          {/if}

          {#if pendingSuggestion}
            <div class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <div class="font-medium">{pendingSuggestion.message}</div>
              {#if pendingSuggestion.warnings?.length}
                <div class="mt-2 space-y-1 text-xs text-amber-700">
                  {#each pendingSuggestion.warnings as warning}
                    <div>{warning.message}</div>
                  {/each}
                </div>
              {/if}
              {#if pendingSuggestion.placements?.length}
                <div class="mt-3 flex items-center justify-between gap-3">
                  <span class="text-xs font-medium uppercase tracking-wide text-emerald-700">
                    {pendingSuggestion.placements.length} placement{pendingSuggestion.placements.length === 1 ? '' : 's'} ready
                  </span>
                  <button class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700" onclick={applySuggestion}>
                    Apply
                  </button>
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <div class="border-t border-slate-200 px-5 py-4">
          <textarea
            bind:value={prompt}
            rows="4"
            class="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition-colors focus:border-slate-400"
            placeholder="Describe the layout change you want..."
            onkeydown={(event) => {
              if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                void sendPrompt();
              }
            }}
          ></textarea>
          <div class="mt-3 flex items-center justify-between gap-3">
            <span class="text-xs text-slate-500">Press Ctrl+Enter to send</span>
            <button
              class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              onclick={sendPrompt}
              disabled={sending || !prompt.trim()}
            >
              {sending ? 'Thinking…' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
