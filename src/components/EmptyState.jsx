export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="text-center py-16 px-4 border border-slate-200 rounded-lg bg-white">
      <p className="font-display text-xl font-semibold text-slate-800">{title}</p>
      {description && <p className="text-slate-500 mt-2 max-w-md mx-auto font-body text-sm">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 bg-accent-500 hover:bg-accent-600 text-white font-medium text-sm px-4 py-2 rounded-md transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
