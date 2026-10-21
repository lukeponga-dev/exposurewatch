<script lang="ts">
  interface Props {
    onCheck: (email: string) => void;
    disabled?: boolean;
  }

  let { onCheck, disabled = false }: Props = $props();
  let email = $state("");

  function submit(event: SubmitEvent) {
    event.preventDefault();
    const value = email.trim();
    if (value) onCheck(value);
  }
</script>

<form class="check-form" onsubmit={submit}>
  <div class="input-group">
    <label for="email" class="label">Email address</label>
    <input
      id="email"
      name="email"
      type="email"
      bind:value={email}
      placeholder="you@example.com"
      autocomplete="email"
      spellcheck="false"
      required
      {disabled}
    />
  </div>
  <button type="submit" disabled={disabled || !email.trim()}>
    {disabled ? "Checking…" : "Check exposure"}
  </button>
  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
    <p class="privacy-hint">Your address is used only to run this exposure check.</p>
    <span class="label" style="opacity: 0.5; font-size: 0.65rem;">No account required</span>
  </div>
</form>

<style>
  .check-form { display: grid; gap: 1.5rem; }
  .input-group { display: flex; flex-direction: column; gap: 0.75rem; }
  .label {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-weight: 700;
    color: var(--ink);
  }
  input {
    width: 100%;
    padding: 1.25rem;
    border: 2px solid var(--ink);
    font-family: 'Space Mono', monospace;
    font-size: 1rem;
    background: var(--bg);
    color: var(--ink);
    outline: none;
    transition: box-shadow 0.2s;
  }
  input::placeholder { color: var(--ink-medium); opacity: 0.6; }
  input:focus { box-shadow: 4px 4px 0 var(--accent); }
  button {
    background: var(--accent);
    color: white;
    border: 2px solid var(--ink);
    padding: 1.25rem 2rem;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 4px 4px 0 var(--ink);
    transition: transform 0.1s, box-shadow 0.1s;
  }
  button:not(:disabled):hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 var(--ink);
  }
  button:disabled {
    background: #ccc;
    cursor: not-allowed;
    box-shadow: none;
  }
  .privacy-hint {
    font-size: 0.75rem;
    color: var(--ink-medium);
    margin: 0;
  }
</style>
