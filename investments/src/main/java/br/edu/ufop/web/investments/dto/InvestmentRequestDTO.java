package br.edu.ufop.web.investments.dto;

import br.edu.ufop.web.investments.enums.EnumAssetType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record InvestmentRequestDTO(
        EnumAssetType type,
        String symbol,
        Double quantity,
        BigDecimal purchasePrice,
        LocalDate purchaseDate
) {}
