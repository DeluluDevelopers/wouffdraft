# Taste (Continuously Learned by [CommandCode][cmd]


# Docs-first

- Before writing any code, read ``docs/ARCHITECTURE.md`` and ``docs/DECISIONS.md`` first to understand the project structure and prior design decisions. Then based on the task, read only the specific files needed — do not read the entire codebase. Confidence: 1.00

# nextjs

- Use ``proxy.ts`` at the project root (not ``middleware.ts``) and export a ``proxy`` function for intercepting API requests. This is the Next.js 16 convention. Confidence: 0.85