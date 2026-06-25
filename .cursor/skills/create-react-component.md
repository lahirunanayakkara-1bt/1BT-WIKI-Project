# Skill: Create React Component

Use this prompt template when creating new UI components for 1BT WIKI.
Paste into Cursor's chat and fill in the placeholders.

---

## Prompt Template

```
Create a React component for 1BT WIKI following the project's frontend conventions.

**Component details:**
- Component name: [PascalCase name]
- File path: `src/components/[domain]/[ComponentName].tsx`
- Purpose: [What this component renders and does]
- Domain owner: [Lahiru | Chathurika | Malindu]

**Props:**
[List all props with their TypeScript types]

**Data source:**
[Does it receive data via props, or does it call a hook? If hook, which one?]

**User interactions:**
[Buttons, forms, modals — what happens when clicked/submitted?]

**UI requirements:**
- [ ] Tailwind CSS only (no inline styles, no custom CSS)
- [ ] Loading state (show spinner while data loads)
- [ ] Error state (show error message if API fails)
- [ ] Empty state (show message if no data)
- [ ] Confirmation modal for destructive actions: [list actions]
- [ ] data-testid attributes on all interactive elements
- [ ] Responsive: mobile-first

**Role-based visibility:**
[Are any parts of the UI shown only to certain roles? e.g., "Delete button only visible to Admin"]

---

Generate:
1. `Props` interface (above the component)
2. The functional component with TypeScript, Tailwind CSS
3. Any sub-components if needed
4. A matching custom hook if the component needs API data (`src/hooks/use[Resource].ts`)
5. The API client function if it doesn't exist (`src/lib/api/[resource].api.ts`)

Rules:
- No class components — functional only
- No inline `style={{}}` — Tailwind only
- All API calls go through a custom hook, not directly in JSX
- Use `data-testid="[semantic-name]"` on buttons, inputs, and key containers
- Use the shared `<ConfirmationModal>` for any delete/submit/publish actions
- Use the shared `<ArticleStatusBadge>` for status display
- Use Clerk's `useUser()` for role checks — never pass role as prop
```

---

## Example (filled in)

```
Create a React component for 1BT WIKI.

Component name: ArticleCard
File path: src/components/articles/ArticleCard.tsx
Purpose: Displays a summary card for an article in list/grid views. Shows title, tags, status badge, view count, like count, comment count, and author info. Clicking navigates to the article detail page.
Domain owner: Malindu

Props:
- id: string
- title: string
- status: 'Draft' | 'Pending' | 'Published' | 'Rejected'
- tags: string[]
- viewCount: number
- likeCount: number
- commentCount: number
- authorName: string
- authorAvatar: string | null
- createdAt: Date

Data source: receives all data via props (parent handles fetching)

User interactions:
- Clicking the card navigates to /articles/[id]
- If status is 'Rejected', show rejection feedback icon that opens a tooltip

UI requirements:
- Loading state: N/A (data comes from parent)
- Responsive: 1 column mobile, 2-3 columns on desktop
- Status badge using ArticleStatusBadge component
- data-testid="article-card", data-testid="article-title", data-testid="article-status"
- Role-based: "Edit" button visible only to the article owner; "Delete" visible to owner (Draft only) and Admin
```
