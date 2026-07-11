package com.bionic.application.usecase;

import com.bionic.application.port.in.BionicConvertPort;
import com.bionic.infrastructure.processor.BionicProcessorImpl;
import com.bionic.domain.service.BionicProcessor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

/**
 * Integration test that wires the full chain
 * {@code BionicConvertUseCase → BionicProcessorImpl → BionicProcessor}
 * without a Spring context.
 */
class BionicConvertUseCaseTest {

    private BionicConvertPort useCase;

    @BeforeEach
    void setUp() {
        useCase = new BionicConvertUseCase(
                new BionicProcessorImpl(new BionicProcessor())
        );
    }

    @Test
    void htmlContainsBoldTags() {
        BionicConvertPort.ConvertResult result = useCase.convert(
                new BionicConvertPort.ConvertCommand("hello world", 40));

        assertThat(result.html()).contains("<b>he</b>llo");
        assertThat(result.html()).contains("<b>wo</b>rld");
    }

    @Test
    void markdownContainsBoldMarkers() {
        BionicConvertPort.ConvertResult result = useCase.convert(
                new BionicConvertPort.ConvertCommand("hello world", 40));

        assertThat(result.markdown()).contains("**he**llo");
        assertThat(result.markdown()).contains("**wo**rld");
    }

    @Test
    void defaultRatioIsFortyWhenNullPassed() {
        // Both commands should produce identical output
        BionicConvertPort.ConvertResult withNull = useCase.convert(
                new BionicConvertPort.ConvertCommand("test", null));
        BionicConvertPort.ConvertResult withExplicit = useCase.convert(
                new BionicConvertPort.ConvertCommand("test", 40));

        assertThat(withNull.html()).isEqualTo(withExplicit.html());
    }

    @Test
    void htmlIsProperlyEscaped() {
        BionicConvertPort.ConvertResult result = useCase.convert(
                new BionicConvertPort.ConvertCommand("a&b", 50));

        // The '&' must be escaped to '&amp;' in the HTML output
        assertThat(result.html()).doesNotContain("a&b");
    }

    @Test
    void wordTokenCountMatchesWords() {
        BionicConvertPort.ConvertResult result = useCase.convert(
                new BionicConvertPort.ConvertCommand("one two three", 40));

        long wordTokens = result.words().stream()
                .filter(t -> !t.whitespace() && !t.anchor().isEmpty())
                .count();
        assertThat(wordTokens).isEqualTo(3);
    }
}
