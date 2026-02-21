package br.edu.ufop.web.investments.dto;

import br.edu.ufop.web.investments.enums.EnumAssetType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record InvestmentResponseDTO(
        UUID id,
        EnumAssetType type,
        String symbol,
        Double quantity,
        BigDecimal purchasePrice,
        LocalDate purchaseDate,
        BigDecimal totalValue
) {}
