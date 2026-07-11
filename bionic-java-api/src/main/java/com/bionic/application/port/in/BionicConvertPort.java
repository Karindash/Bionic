package com.bionic.application.port.in;

/**
 * Input port (driving side) for the Bionic conversion use case.
 *
 * <p>Separating the port interface from its implementation keeps the
 * application layer independent of any delivery mechanism (HTTP, gRPC, CLI…).
 */
public interface BionicConvertPort {

    /**
     * Convert {@code text} using the given {@code ratio}.
     *
     * @param command  encapsulates all inputs needed for the operation
     * @return structured conversion result
     */
    ConvertResult convert(ConvertCommand command);

    // -------------------------------------------------------------------------
    // Command (input)
    // -------------------------------------------------------------------------

    /**
     * Immutable command object.  The ratio defaults to 40 when not supplied.
     *
     * @param text  the raw text to convert (must not be blank)
     * @param ratio anchor percentage (1–99); pass {@code null} to use default
     */
    record ConvertCommand(String text, Integer ratio) {

        private static final int DEFAULT_RATIO = 40;

        public ConvertCommand {
            if (text == null || text.isBlank()) {
                throw new IllegalArgumentException("text must not be blank");
            }
            if (ratio != null && (ratio < 1 || ratio > 99)) {
                throw new IllegalArgumentException("ratio must be between 1 and 99");
            }
        }

        /** Returns the effective ratio, falling back to the default. */
        public int effectiveRatio() {
            return ratio != null ? ratio : DEFAULT_RATIO;
        }
    }

    // -------------------------------------------------------------------------
    // Result (output)
    // -------------------------------------------------------------------------

    /**
     * Structured result returned by the use case.
     *
     * @param words   ordered list of transformed word tokens
     * @param html    ready-to-render HTML snippet ({@code <b>anchor</b>rest})
     * @param markdown ready-to-render Markdown snippet ({@code **anchor**rest})
     */
    record ConvertResult(java.util.List<WordToken> words, String html, String markdown) {}

    /**
     * A single token as seen by callers outside the domain.
     *
     * @param original  raw token string
     * @param anchor    bold portion
     * @param rest      plain trailing portion of the word body
     * @param suffix    punctuation / symbols after the word
     * @param whitespace true if the token is only whitespace
     */
    record WordToken(
            String original,
            String anchor,
            String rest,
            String suffix,
            boolean whitespace
    ) {}
}
