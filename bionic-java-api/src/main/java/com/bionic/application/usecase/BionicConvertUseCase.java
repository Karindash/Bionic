package com.bionic.application.usecase;

import com.bionic.application.port.in.BionicConvertPort;
import com.bionic.application.port.out.BionicProcessorPort;
import com.bionic.domain.model.BionicWord;

import java.util.List;
import java.util.StringJoiner;

/**
 * Core use case: converts plain text into Bionic-annotated output.
 *
 * <p>Orchestration responsibility only — no domain logic lives here.
 * Domain logic stays in {@link com.bionic.domain.service.BionicProcessor};
 * the actual instance is injected via {@link BionicProcessorPort}.
 *
 * <p>This class carries no Spring annotations deliberately; wiring is done
 * in the configuration layer so the use case remains testable without a
 * Spring context.
 */
public class BionicConvertUseCase implements BionicConvertPort {

    private final BionicProcessorPort processorPort;

    public BionicConvertUseCase(BionicProcessorPort processorPort) {
        this.processorPort = processorPort;
    }

    @Override
    public ConvertResult convert(ConvertCommand command) {
        int ratio = command.effectiveRatio();
        List<BionicWord> domainWords = processorPort.process(command.text(), ratio);

        List<WordToken> tokens = domainWords.stream()
                .map(w -> new WordToken(w.original(), w.anchor(), w.rest(), w.suffix(), w.whitespace()))
                .toList();

        String html     = buildHtml(domainWords);
        String markdown = buildMarkdown(domainWords);

        return new ConvertResult(tokens, html, markdown);
    }

    // -------------------------------------------------------------------------
    // Rendering helpers (pure string assembly – no HTTP / template engine)
    // -------------------------------------------------------------------------

    private String buildHtml(List<BionicWord> words) {
        StringBuilder sb = new StringBuilder();
        for (BionicWord w : words) {
            if (w.whitespace()) {
                sb.append(escapeHtml(w.original()));
            } else if (w.isPunctuation()) {
                sb.append(escapeHtml(w.original()));
            } else {
                sb.append("<b>").append(escapeHtml(w.anchor())).append("</b>")
                  .append(escapeHtml(w.rest()))
                  .append(escapeHtml(w.suffix()));
            }
        }
        return sb.toString();
    }

    private String buildMarkdown(List<BionicWord> words) {
        StringBuilder sb = new StringBuilder();
        for (BionicWord w : words) {
            if (w.whitespace()) {
                sb.append(w.original());
            } else if (w.isPunctuation()) {
                sb.append(w.original());
            } else {
                sb.append("**").append(w.anchor()).append("**")
                  .append(w.rest())
                  .append(w.suffix());
            }
        }
        return sb.toString();
    }

    /** Minimal HTML escaping — safe for injecting into DOM. */
    private String escapeHtml(String s) {
        if (s == null || s.isEmpty()) return s;
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }
}
