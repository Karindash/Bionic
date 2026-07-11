package com.bionic.application.port.out;

import com.bionic.domain.model.BionicWord;

import java.util.List;

/**
 * Output port (driven side).
 *
 * <p>The use case depends only on this interface.  The actual implementation
 * lives in the infrastructure layer and is injected at runtime, keeping the
 * application layer decoupled from any concrete processing library.
 */
public interface BionicProcessorPort {

    /**
     * Tokenize and transform {@code text} using the given {@code ratio}.
     *
     * @param text  raw input text
     * @param ratio anchor percentage (1–99)
     * @return ordered list of domain {@link BionicWord} tokens
     */
    List<BionicWord> process(String text, int ratio);
}
