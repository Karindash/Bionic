package com.bionic.domain.model;

/**
 * Represents a single tokenized word after Bionic transformation.
 *
 * <ul>
 *   <li><b>original</b>  – the raw token as it appeared in the source text</li>
 *   <li><b>anchor</b>    – the bolded leading portion (the "fixation point")</li>
 *   <li><b>rest</b>      – the unbolded trailing portion of the alphabetic word</li>
 *   <li><b>suffix</b>    – any non-alphabetic tail (punctuation, symbols)</li>
 *   <li><b>whitespace</b>– true when the token is only whitespace / newline</li>
 * </ul>
 *
 * This is an immutable value object; all mutation returns new instances.
 */
public record BionicWord(
        String original,
        String anchor,
        String rest,
        String suffix,
        boolean whitespace
) {
    /** Convenience factory for whitespace-only tokens. */
    public static BionicWord ofWhitespace(String raw) {
        return new BionicWord(raw, "", raw, "", true);
    }

    /** Convenience factory for non-word tokens (pure punctuation / symbols). */
    public static BionicWord ofPunctuation(String raw, String suffix) {
        return new BionicWord(raw, "", raw, suffix, false);
    }

    /** Convenience factory for regular words. */
    public static BionicWord ofWord(String original, String anchor, String rest, String suffix) {
        return new BionicWord(original, anchor, rest, suffix, false);
    }

    /** Returns true when this token has no boldable word characters. */
    public boolean isPunctuation() {
        return !whitespace && anchor.isEmpty();
    }
}
