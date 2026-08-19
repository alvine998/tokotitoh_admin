# Taste

## Communication & workflow
- Reports bugs by pasting the IDE error context (file + line number) with a one-line note (e.g., "this error from /admin/dashboard"), expecting the assistant to trace the error to its real source rather than only patching the file named in the snippet. Confidence: 0.6

## Design & UI
- Wants admin pages to look polished and consistent; repeatedly requests "improve UI" page-by-page across the app (dashboard, then /main/customer), expecting each page to adopt the same modern design language: white cards on a gray surface, colored icon containers, consistent spacing (e.g., `space-y-6` / `gap-4`), responsive grids, styled search fields, status badge pills, and icon-only action buttons. Confidence: 0.7
- Prefers shared UI/table styling to be extracted into a reusable component so an improvement propagates across all pages at once — when a style object (e.g., `CustomTableStyle`) is used by many pages, updates it centrally instead of only patching the requested page. Confidence: 0.6
