package com.bionic.interfaces.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Translates exceptions into RFC 7807 Problem Detail responses.
 *
 * <ul>
 *   <li>Bean Validation failures → 400 with per-field errors</li>
 *   <li>Domain {@link IllegalArgumentException} → 400</li>
 *   <li>Uncaught exceptions → 500 (no detail leaked)</li>
 * </ul>
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final URI VALIDATION_TYPE = URI.create("https://bionic.example.com/errors/validation");
    private static final URI DOMAIN_TYPE     = URI.create("https://bionic.example.com/errors/domain");
    private static final URI INTERNAL_TYPE   = URI.create("https://bionic.example.com/errors/internal");

    /** Handles @Valid / @Validated failures with per-field detail. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "invalid value",
                        (a, b) -> a   // keep first message if field appears twice
                ));

        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "One or more request fields are invalid.");
        pd.setType(VALIDATION_TYPE);
        pd.setTitle("Validation Error");
        pd.setProperty("errors", fieldErrors);
        return pd;
    }

    /** Handles domain / argument errors raised by use-case or domain service. */
    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleIllegalArgument(IllegalArgumentException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        pd.setType(DOMAIN_TYPE);
        pd.setTitle("Bad Request");
        return pd;
    }

    /** Catch-all — hides implementation details from external callers. */
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleUnexpected(Exception ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred. Please try again later.");
        pd.setType(INTERNAL_TYPE);
        pd.setTitle("Internal Server Error");
        return pd;
    }
}
