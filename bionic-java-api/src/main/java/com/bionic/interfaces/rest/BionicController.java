package com.bionic.interfaces.rest;

import com.bionic.application.port.in.BionicConvertPort;
import com.bionic.interfaces.rest.dto.BionicConvertRequest;
import com.bionic.interfaces.rest.dto.BionicConvertResponse;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for the Bionic text transformation API.
 *
 * <p>This is a thin adapter: it translates HTTP ↔ use-case objects and nothing
 * more.  No business logic lives here.
 *
 * <h2>Endpoints</h2>
 * <pre>
 * POST /api/v1/bionic/convert
 *   Body : { "text": "...", "ratio": 40 }
 *   200  : BionicConvertResponse
 * </pre>
 */
@RestController
@RequestMapping(path = "/api/v1/bionic", produces = MediaType.APPLICATION_JSON_VALUE)
public class BionicController {

    private final BionicConvertPort bionicConvertPort;

    public BionicController(BionicConvertPort bionicConvertPort) {
        this.bionicConvertPort = bionicConvertPort;
    }

    /**
     * Convert plain text to Bionic-annotated output.
     *
     * @param request body with {@code text} and optional {@code ratio}
     * @return {@link BionicConvertResponse} with tokens, HTML, and Markdown
     */
    @PostMapping(path = "/convert", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BionicConvertResponse> convert(@Valid @RequestBody BionicConvertRequest request) {

        BionicConvertPort.ConvertCommand command =
                new BionicConvertPort.ConvertCommand(request.text(), request.ratio());

        BionicConvertPort.ConvertResult result = bionicConvertPort.convert(command);

        return ResponseEntity.ok(BionicConvertResponse.from(result, command.effectiveRatio()));
    }
}
