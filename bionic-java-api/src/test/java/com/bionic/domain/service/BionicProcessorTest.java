package com.bionic.domain.service;

import com.bionic.domain.model.BionicWord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.util.List;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.*;

/**
 * Unit tests for {@link BionicProcessor}.
 *
 * No Spring context — plain JUnit 5 + AssertJ.
 */
class BionicProcessorTest {

    private BionicProcessor processor;

    @BeforeEach
    void setUp() {
        processor = new BionicProcessor();
    }

    // -------------------------------------------------------------------------
    // Null / empty guards
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("null input returns empty list")
    void nullInputReturnsEmpty() {
        assertThat(processor.process(null, 40)).isEmpty();
    }

    @Test
    @DisplayName("empty string returns empty list")
    void emptyInputReturnsEmpty() {
        assertThat(processor.process("", 40)).isEmpty();
    }

    // -------------------------------------------------------------------------
    // Ratio validation
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("ratio 0 throws IllegalArgumentException")
    void ratioZeroThrows() {
        assertThatIllegalArgumentException()
                .isThrownBy(() -> processor.process("hello", 0));
    }

    @Test
    @DisplayName("ratio 100 throws IllegalArgumentException")
    void ratio100Throws() {
        assertThatIllegalArgumentException()
                .isThrownBy(() -> processor.process("hello", 100));
    }

    // -------------------------------------------------------------------------
    // Single-word anchor/rest split — matches useBionic.ts formula
    //   anchorLength = max(1, round(wordLength * ratio / 100))
    // -------------------------------------------------------------------------

    @ParameterizedTest(name = "word=\"{0}\" ratio={1} → anchor=\"{2}\" rest=\"{3}\"")
    @CsvSource({
            // 1-letter words always anchor the single char
            "a,     40, a, ''",
            // "hello" (5) @ 40% → round(5*0.4)=round(2)=2
            "hello, 40, he, llo",
            // "hello" (5) @ 50% → round(5*0.5)=round(2.5)=3
            "hello, 50, hel, lo",
            // "read"  (4) @ 40% → round(4*0.4)=round(1.6)=2
            "read,  40, re, ad",
            // "I"     (1) @ 40% → max(1,round(0.4))=1
            "I,     40, I,  ''",
            // "combining" (9) @ 40% → round(9*0.4)=round(3.6)=4
            "combining, 40, comb, ining",
    })
    @DisplayName("anchor/rest split is correct")
    void anchorRestSplit(String word, int ratio, String expectedAnchor, String expectedRest) {
        List<BionicWord> words = processor.process(word, ratio);
        BionicWord bionicWord = wordsOnly(words).get(0);

        assertThat(bionicWord.anchor()).isEqualTo(expectedAnchor);
        assertThat(bionicWord.rest()).isEqualTo(expectedRest.replace("''", ""));
    }

    // -------------------------------------------------------------------------
    // Suffix preservation
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("trailing punctuation is kept as suffix, not bolded")
    void suffixPreserved() {
        List<BionicWord> words = processor.process("hello,", 40);
        BionicWord w = wordsOnly(words).get(0);

        assertThat(w.anchor()).isEqualTo("he");
        assertThat(w.rest()).isEqualTo("llo");
        assertThat(w.suffix()).isEqualTo(",");
    }

    @Test
    @DisplayName("word with exclamation mark keeps suffix correctly")
    void exclamationSuffix() {
        List<BionicWord> words = processor.process("Bionic!", 50);
        BionicWord w = wordsOnly(words).get(0);

        assertThat(w.anchor()).isEqualTo("Bio");
        assertThat(w.rest()).isEqualTo("nic");
        assertThat(w.suffix()).isEqualTo("!");
    }

    // -------------------------------------------------------------------------
    // Whitespace tokens
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("whitespace tokens are emitted with whitespace=true")
    void whitespaceTokensPreserved() {
        List<BionicWord> result = processor.process("foo bar", 40);
        long whitespaceCount = result.stream().filter(BionicWord::whitespace).count();
        assertThat(whitespaceCount).isGreaterThanOrEqualTo(1);
    }

    @Test
    @DisplayName("multi-word input produces one word-token per word")
    void multiWordCount() {
        List<BionicWord> result = processor.process("one two three", 40);
        assertThat(wordsOnly(result)).hasSize(3);
    }

    // -------------------------------------------------------------------------
    // End-to-end: reconstruction from tokens equals original text
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("concatenating all original tokens reproduces the source text")
    void reconstructionEqualsOriginal() {
        String source = "Bionic reading is fast and effective.";
        List<BionicWord> words = processor.process(source, 40);

        String reconstructed = words.stream()
                .map(BionicWord::original)
                .collect(Collectors.joining());

        assertThat(reconstructed).isEqualTo(source);
    }

    // -------------------------------------------------------------------------
    // Boundary: single character
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("single character always produces anchor of length 1")
    void singleCharAnchor() {
        List<BionicWord> words = processor.process("I", 40);
        assertThat(wordsOnly(words).get(0).anchor()).isEqualTo("I");
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private List<BionicWord> wordsOnly(List<BionicWord> all) {
        return all.stream()
                .filter(w -> !w.whitespace() && !w.isPunctuation())
                .toList();
    }
}
