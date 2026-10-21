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
    <div class="label-row">
      <label for="email" class="label">Target Email Address</label>
      <span class="scan-pill">
        <span class="scan-dot" aria-hidden="true"></span>
        Ready to scan
      </span>
    </div>
    <div class="input-wrap">
      <svg class="mail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
      </svg>
      <input
        id="email"
        name="email"
        type="email"
        bind:value={email}
        placeholder="target@company.com"
        autocomplete="email"
        spellcheck="false"
        required
        {disabled}
      />
    </div>
  </div>

  <button type="submit" class="submit-btn" disabled={disabled || !email.trim()}>
    <span class="btn-text">
      {#if disabled}
        <span class="mini-spinner" aria-hidden="true"></span>
        Scanning Breach Records…
      {:else}
        <span>Check Exposure</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      {/if}
    </span>
  </button>

  <div class="form-footer">
    <p class="privacy-hint">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
      Queries are not saved or logged
    </p>
    <span class="badge-free">Instant Result</span>
  </div>
</form>

<style>
  .check-form {
    display: grid;
    gap: 1.25rem;
  }
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .label {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
    color: var(--text-primary, #2B2B2B);
  }
  .scan-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-family: ui-monospace, monospace;
    font-size: 0.68rem;
    color: var(--accent, #006B73);
    font-weight: 600;
  }
  .scan-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent, #006B73);
  }
  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .mail-icon {
    position: absolute;
    left: 1.15rem;
    color: var(--text-secondary, #5A5A5A);
    pointer-events: none;
    transition: color 0.15s;
  }
  input {
    width: 100%;
    height: 52px;
    padding: 0 1.2rem 0 3rem;
    border: 1px solid var(--border, #D7D7D5);
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.95rem;
    background: var(--surface, #FFFFFF);
    color: var(--text-primary, #2B2B2B);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background-color 0.15s;
  }
  input::placeholder {
    color: var(--text-tertiary, #9C9C9C);
  }
  input:hover {
    border-color: var(--accent, #006B73);
  }
  input:focus {
    border-color: var(--accent, #006B73);
    box-shadow: 0 0 0 3px rgba(0, 107, 115, 0.2);
  }
  .input-wrap:focus-within .mail-icon {
    color: var(--accent, #006B73);
  }

  .submit-btn {
    height: 52px;
    border: none;
    border-radius: 8px;
    background: var(--accent, #006B73);
    color: var(--accent-contrast, #FFFFFF);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    transition: background-color 0.15s, transform 0.1s;
  }
  .btn-text {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
  }
  .submit-btn:not(:disabled):hover {
    background: var(--accent-hover, #00848D);
  }
  .submit-btn:not(:disabled):active {
    transform: translateY(1px);
  }
  .submit-btn:disabled {
    background: var(--border, #D7D7D5);
    color: var(--text-tertiary, #9C9C9C);
    cursor: not-allowed;
  }
  .mini-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .form-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 0.1rem;
  }
  .privacy-hint {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.76rem;
    color: var(--text-secondary, #5A5A5A);
  }
  .badge-free {
    font-family: ui-monospace, monospace;
    font-size: 0.68rem;
    color: var(--accent, #006B73);
    background: var(--accent-soft, #E0F4F5);
    padding: 0.2rem 0.55rem;
    border-radius: 4px;
    font-weight: 600;
  }
</style>
