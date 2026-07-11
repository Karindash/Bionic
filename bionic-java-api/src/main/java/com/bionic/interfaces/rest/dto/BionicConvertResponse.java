package com.bionic.interfaces.rest.dto;

import com.bionic.application.port.in.BionicConvertPort;

import java.util.List;

/**
 * Outgoing response body from the Bionic conversion endpoint.
 *
 * @param words    ordered list of word tokens (anchor / rest / suffix breakdown)
 * @param html     ready-to-render HTML snippet
 * @param markdown ready-to-render Markdown snippet
 * @param ratio    the effective ratio used for this conversion
 */
public record BionicConvertResponse(
        List<WordTokenDto> words,
        String html,
        String markdown,
        int ratio
) {

    /**
     * Maps a use-case result to the HTTP response shape.
     *
     * @param result   use-case output
     * @param ratio    effective ratio used
     */
    public static BionicConvertResponse from(BionicConvertPort.ConvertResult result, int ratio) {
        List<WordTokenDto> dtos = result.words().stream()
                .map(WordTokenDto::from)
                .toList();
        return new BionicConvertResponse(dtos, result.html(), result.markdown(), ratio);
    }

    // -------------------------------------------------------------------------

    /**
     * Per-word breakdown exposed to the caller.
     *
     * @param original   raw token as it appeared in the source
     * @param anchor     bolded portion
     * @param rest       unbolded tail of the word body
     * @param suffix     trailing punctuation
     * @param whitespace true if the token is whitespace only
     */
    public record WordTokenDto(
            String original,
            String anchor,
            String rest,
            String suffix,
            boolean whitespace
    ) {
        static WordTokenDto from(BionicConvertPort.WordToken t) {
            return new WordTokenDto(t.original(), t.anchor(), t.rest(), t.suffix(), t.whitespace());
        }
    }
}
