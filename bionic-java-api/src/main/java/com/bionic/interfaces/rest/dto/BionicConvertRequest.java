package com.bionic.interfaces.rest.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Incoming request body for the Bionic conversion endpoint.
 *
 * @param text  the plain text to convert (required, max 100 000 chars)
 * @param ratio anchor percentage 1–99; omit to use the server default (40)
 */
public record BionicConvertRequest(

        @NotBlank(message = "text must not be blank")
        @Size(max = 100_000, message = "text must not exceed 100 000 characters")
        String text,

        @Min(value = 1, message = "ratio must be at least 1")
        @Max(value = 99, message = "ratio must be at most 99")
        Integer ratio
) {}
