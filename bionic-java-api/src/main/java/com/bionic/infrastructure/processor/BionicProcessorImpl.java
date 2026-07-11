package com.bionic.infrastructure.processor;

import com.bionic.application.port.out.BionicProcessorPort;
import com.bionic.domain.model.BionicWord;
import com.bionic.domain.service.BionicProcessor;

import java.util.List;

/**
 * Infrastructure adapter that implements the {@link BionicProcessorPort} output port
 * by delegating to the pure-domain {@link BionicProcessor}.
 *
 * <p>Placing this class in the infrastructure layer keeps the door open to swapping
 * the underlying algorithm (e.g. ML-based fixation, dictionary-driven highlighting)
 * without touching any application or domain code.
 *
 * <p>Spring wiring is done in {@code BionicConfig} — this class is annotation-free
 * so it can be instantiated and tested without a Spring context.
 */
public class BionicProcessorImpl implements BionicProcessorPort {

    private final BionicProcessor domainProcessor;

    public BionicProcessorImpl(BionicProcessor domainProcessor) {
        this.domainProcessor = domainProcessor;
    }

    @Override
    public List<BionicWord> process(String text, int ratio) {
        return domainProcessor.process(text, ratio);
    }
}
