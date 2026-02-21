package br.edu.ufop.web.investments.controller;

import br.edu.ufop.web.investments.dto.InvestmentRequestDTO;
import br.edu.ufop.web.investments.dto.InvestmentSummaryDTO;
import br.edu.ufop.web.investments.entity.InvestmentEntity;
import br.edu.ufop.web.investments.enums.EnumAssetType;
import br.edu.ufop.web.investments.service.InvestmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/investments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // -> para o react
public class InvestmentController {
    private final InvestmentService service;

    @PostMapping
    public ResponseEntity<InvestmentEntity> create(@RequestBody InvestmentRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));    }

    @GetMapping
    public ResponseEntity<List<InvestmentEntity>> getAll(@RequestParam(required = false) EnumAssetType type) {
        return ResponseEntity.ok(service.listAll(type));
    }

    @GetMapping("/summary")
    public ResponseEntity<InvestmentSummaryDTO> getSummary() {
        return ResponseEntity.ok(service.getSummary());
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvestmentEntity> update(@RequestBody InvestmentRequestDTO dto, @PathVariable UUID id) {
        return ResponseEntity.ok(service.update(dto, id));    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
