export function Toast({ message }: { message: string | null }) {
  return (
    <div
      className={`toast ${message ? 'is-visible' : ''}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="toast__dot" />
      {message}
    </div>
  )
}
