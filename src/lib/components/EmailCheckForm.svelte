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
  <label for="email">Email address</label>
  <div class="input-row">
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
    <button type="submit" disabled={disabled || !email.trim()}>
      {disabled ? "Checking…" : "Check exposure"}
    </button>
  </div>
  <p>Your address is used only to run this exposure check.</p>
</form>

<style>
  .check-form { display: grid; gap: .65rem; }
  label { color: #b9c9da; text-transform: uppercase; font: 700 .65rem ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .16em; }
  .input-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: .8rem; }
  input { min-width: 0; min-height: 60px; border: 1px solid #2b4461; border-radius: .62rem; padding: 0 1.1rem; background: #071323; color: var(--text); outline: none; transition: border-color .2s, box-shadow .2s, background .2s; }
  input::placeholder { color: #60748d; }
  input:hover { border-color: #3a5876; }
  input:focus { border-color: var(--accent); background: #09182a; box-shadow: 0 0 0 3px rgba(25, 211, 243, .12), 0 0 22px rgba(25, 211, 243, .09); }
  button { min-height: 60px; border: 0; border-radius: .62rem; padding: 0 1.7rem; background: var(--violet); color: white; font-weight: 760; cursor: pointer; transition: transform .18s, filter .18s, box-shadow .18s; }
  button:not(:disabled):hover { transform: translateY(-1px); filter: brightness(1.09); box-shadow: 0 12px 30px rgba(108, 92, 255, .25); }
  button:focus-visible { outline: 3px solid rgba(82, 229, 255, .5); outline-offset: 3px; }
  button:disabled { opacity: .62; cursor: not-allowed; }
  p { margin: 0; color: var(--muted); font-size: .73rem; }
  @media (max-width: 640px) { .input-row { grid-template-columns: 1fr; } }
</style>
