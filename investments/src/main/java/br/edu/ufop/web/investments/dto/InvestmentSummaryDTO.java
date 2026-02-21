package br.edu.ufop.web.investments.dto;

import br.edu.ufop.web.investments.enums.EnumAssetType;

import java.math.BigDecimal;
import java.util.Map;

public record InvestmentSummaryDTO(
        BigDecimal totalInvested,
        Map<EnumAssetType, BigDecimal> totalByType,
        long assetCount
) {}
