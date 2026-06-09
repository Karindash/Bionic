# Roadmap: Milestones & Timeline

## Milestone 1: The Robust Core (Weeks 1-2)
*Goal: Ensure the Bionic logic and PDF parsing are rock-solid.*
- [ ] **Refine `useBionic`:** Handle edge cases (hyphenated words, special characters like `©`, `®`).
- [ ] **PDF Optimization:** Improve text extraction to respect line breaks better.
- [ ] **Basic UI Polish:** Implement a clean, responsive layout using the existing `theme.css`.

## Milestone 2: User Experience & Accessibility (Weeks 3-4)
*Goal: Make the app "Global Ready" and user-friendly.*
- [ ] **Dark Mode / Light Mode:** Automatic detection and toggle.
- [ ] **Font Settings:** Add "Dyslexic Friendly" font options.
- [ ] **Mobile Responsive:** Ensure the reader works perfectly on phones.
- [ ] **Accessibility (a11y):** Ensure screen readers can still read the text despite the `<b>` tags.

## Milestone 3: The Library System (Weeks 5-6)
*Goal: Transition from a tool to an application.*
- [ ] **Local Storage:** Save the "Library" of uploaded files to the browser.
- [ ] **Reading Progress:** Save where the user left off in a 50-page PDF.
- [ ] **Dashboard:** A simple grid view of "Recent Reads".

## Milestone 4: Deployment & SDLC (Week 7)
*Goal: Professionalize the release.*
- [ ] **CI/CD:** Set up GitHub Actions to auto-deploy to Vercel.
- [ ] **Automated Tests:** Write simple Vitest unit tests for the `useBionic` logic.
- [ ] **Feedback Loop:** Add a simple "Report Bug" or "Request Feature" button.

---

## SDLC Mock Cycle (For Learning)
1. **Planning:** Update `PRD.md` with new features.
2. **Analysis:** Check `TECHNICAL_DESIGN.md` for impact.
3. **Design:** Sketch UI changes.
4. **Implementation:** Write the code.
5. **Testing:** Manually verify and run unit tests.
6. **Deployment:** Push to GitHub.
