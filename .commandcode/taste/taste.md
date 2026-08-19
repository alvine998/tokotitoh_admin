# Taste

## Communication & workflow
- Reports bugs by pasting the IDE error context (file + line number) with a one-line note (e.g., "this error from /admin/dashboard"), expecting the assistant to trace the error to its real source rather than only patching the file named in the snippet. Confidence: 0.6

## Design & UI
- Wants admin pages to look polished and consistent; repeatedly requests "improve UI" page-by-page across the app (dashboard, then /main/customer, then /main/ads including its tab pages and the detail page), expecting each page to adopt the same modern design language: white cards on a gray surface, colored icon containers, consistent spacing (e.g., `space-y-6` / `gap-4`), responsive grids, styled search fields, status badge pills, and icon-only action buttons. This applies to detail views and sub-pages as well as main list pages. Confidence: 0.8
- Prefers shared UI/table styling to be extracted into a reusable component so an improvement propagates across all pages at once — when a style object (e.g., `CustomTableStyle`) is used by many pages, updates it centrally instead of only patching the requested page. Confidence: 0.6
- Consistent, idiomatic UI patterns are valued even when the assistant must implement them from scratch: status values rendered as colored badge pills (amber/green/red), status shown with an icon badge in the detail header, sectioned white cards (images / description / info grid) on detail pages, icon-only action links, inline modal overlay with a `Loader2` spinner on submit buttons, and back button as a bordered icon button. Confidence: 0.6
- Image galleries on detail pages should be restyled as a main image + thumbnail grid, and clicking any image should open a full-size lightbox modal (dark overlay, close button, image counter, prev/next navigation, keyboard support) instead of a static strip of thumbnails. Confidence: 0.5
