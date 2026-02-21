package br.edu.ufop.web.investments.service;

import br.edu.ufop.web.investments.dto.InvestmentRequestDTO;
import br.edu.ufop.web.investments.dto.InvestmentSummaryDTO;
import br.edu.ufop.web.investments.entity.InvestmentEntity;
import br.edu.ufop.web.investments.enums.EnumAssetType;
import br.edu.ufop.web.investments.repository.IInvestmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvestmentService {
    private final IInvestmentRepository repository;

    // Listar com filtro
    public List<InvestmentEntity> listAll(EnumAssetType type) {
        if(type != null) {
            return repository.findByType(type);
        }
        return repository.findAll();
    }

    // Create de Ativo
    @Transactional
    public InvestmentEntity create(InvestmentRequestDTO dto) {
        InvestmentEntity entity = InvestmentEntity.builder()
                .type(dto.type())
                .symbol(dto.symbol())
                .quantity(dto.quantity())
                .purchasePrice(dto.purchasePrice())
                .purchaseDate(dto.purchaseDate())
                .build();
        return repository.save(entity);
    }

    // Update Ativo
    @Transactional
    public InvestmentEntity update(InvestmentRequestDTO dto, UUID id) {
        InvestmentEntity entity = repository.findById(id)
                .orElseThrow( () -> new RuntimeException("Ativo não encontrado!"));

        entity.setType(dto.type());
        entity.setSymbol(dto.symbol());
        entity.setQuantity(dto.quantity());
        entity.setPurchasePrice(dto.purchasePrice());
        entity.setPurchaseDate(dto.purchaseDate());

        return repository.save(entity);
    }

    // Delete Ativo
    @Transactional
    public void delete(UUID id) {
        if(!repository.existsById(id)) {
            throw new RuntimeException("Ativo não encontrado!");
        }
        repository.deleteById(id);
    }

    // Summary da Carteira
    public InvestmentSummaryDTO getSummary(){
        List<InvestmentEntity> all = repository.findAll();

        BigDecimal totalInvested = all.stream()
                .map(i -> i.getPurchasePrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<EnumAssetType, BigDecimal> totalByType = all.stream()
                .collect(Collectors.groupingBy(
                        InvestmentEntity::getType,
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                i -> i.getPurchasePrice().multiply(BigDecimal.valueOf(i.getQuantity())),
                                BigDecimal::add
                        )
                ));
        return new InvestmentSummaryDTO(totalInvested, totalByType, all.size());
    }
}
