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
      required
      {disabled}
    />
    <button type="submit" disabled={disabled || !email.trim()}>
      {disabled ? "Checking…" : "Check exposure"}
    </button>
  </div>
  <p>We’ll check the address against the ExposureWatch service.</p>
</form>

<style>
  .check-form {
    display: grid;
    gap: 0.6rem;
  }
  label {
    font-weight: 650;
  }
  .input-row {
    display: flex;
    gap: 0.7rem;
  }
  input {
    flex: 1;
    min-width: 0;
    border: 1px solid var(--border);
    border-radius: 0.8rem;
    padding: 0.9rem 1rem;
    background: var(--surface);
    color: var(--text);
    font: inherit;
  }
  button {
    border: 0;
    border-radius: 0.8rem;
    padding: 0.9rem 1.1rem;
    background: var(--accent);
    color: white;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  p {
    margin: 0;
    color: var(--muted);
    font-size: 0.9rem;
  }
  @media (max-width: 640px) {
    .input-row {
      flex-direction: column;
    }
  }
</style>
