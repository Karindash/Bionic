# Bionic React Suite

A modular React implementation of Bionic Reading and RSVP (Rapid Serial Visual Presentation) principles.

## Features

- **RSVP Speed Reader**: Flashes words one-at-a-time with punctuation-aware timing and focal-point alignment.
- **Long-Form Reader**: Applies bionic highlighting to full texts with adjustable bolding ratios.
- **Text Converter**: A utility to convert plain text into Bionic-formatted HTML or Markdown.
- **Shared Bionic Hook**: A flexible `useBionic` hook for use in any React component.

## Getting Started

1. Copy the `src/hooks/useBionic.ts` and `src/styles/theme.css` into your project.
2. Import the components you need from `src/components/`.
3. Use the `App.tsx` as a reference for integration.

## Bionic Principle

Bionic Reading bolds the first few characters of each word (the "anchor"). This allows the eye to skim over the text while the brain fills in the rest, significantly increasing reading speed without sacrificing comprehension.
