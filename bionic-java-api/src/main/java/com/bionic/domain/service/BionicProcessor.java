package com.bionic.domain.service;

import com.bionic.domain.model.BionicWord;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Core Bionic processing algorithm.
 *
 * <p>Mirrors the logic in {@code useBionic.ts}:
 * <ol>
 *   <li>Split the input by whitespace, preserving whitespace tokens.</li>
 *   <li>For each token, extract the word body and a trailing suffix (punctuation).</li>
 *   <li>Compute {@code anchorLength = max(1, round(wordLength * ratio / 100))}.</li>
 *   <li>Split the word into {@code anchor} (bolded) + {@code rest} (plain).</li>
 * </ol>
 *
 * <p>This class is a <em>pure domain service</em>: no Spring annotations, no I/O.
 * It can be unit-tested without starting an application context.
 */
public class BionicProcessor {

    /**
     * Matches the alphabetic / numeric body of a word followed by an optional
     * punctuation/symbol suffix.  Apostrophes and curly-quotes inside words are
     * kept as part of the body (e.g. "it's", "don't").
     */
    private static final Pattern WORD_PATTERN =
            Pattern.compile("^([\\p{L}\\p{N}''\u2019]+)(.*)$", Pattern.UNICODE_CHARACTER_CLASS);

    private static final Pattern WHITESPACE_PATTERN = Pattern.compile("^\\s+$");

    /**
     * Splits {@code text} into a list of {@link BionicWord} tokens.
     *
     * @param text  source text (may be multi-line)
     * @param ratio percentage of each word to use as the bold anchor (1–99)
     * @return ordered list of tokens ready for rendering
     */
    public List<BionicWord> process(String text, int ratio) {
        validateRatio(ratio);

        if (text == null || text.isEmpty()) {
            return List.of();
        }

        // Split on whitespace boundaries, keeping delimiters (whitespace tokens)
        String[] parts = text.split("((?<=\\s)|(?=\\s))");
        List<BionicWord> result = new ArrayList<>(parts.length);

        for (String part : parts) {
            result.add(tokenize(part, ratio));
        }

        return result;
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private BionicWord tokenize(String part, int ratio) {
        if (WHITESPACE_PATTERN.matcher(part).matches()) {
            return BionicWord.ofWhitespace(part);
        }

        Matcher matcher = WORD_PATTERN.matcher(part);
        if (!matcher.matches()) {
            // Pure punctuation / symbols — no anchor
            return BionicWord.ofPunctuation(part, part);
        }

        String word   = matcher.group(1);   // alphabetic body
        String suffix = matcher.group(2);   // trailing punctuation (may be empty)

        int anchorLength = Math.max(1, (int) Math.round(word.length() * ratio / 100.0));
        String anchor = word.substring(0, anchorLength);
        String rest   = word.substring(anchorLength);

        return BionicWord.ofWord(part, anchor, rest, suffix);
    }

    private void validateRatio(int ratio) {
        if (ratio < 1 || ratio > 99) {
            throw new IllegalArgumentException(
                    "Bionic ratio must be between 1 and 99, got: " + ratio);
        }
    }
}
