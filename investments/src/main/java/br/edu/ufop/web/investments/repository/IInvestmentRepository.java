package br.edu.ufop.web.investments.repository;

import br.edu.ufop.web.investments.entity.InvestmentEntity;
import br.edu.ufop.web.investments.enums.EnumAssetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IInvestmentRepository extends JpaRepository<InvestmentEntity, UUID> {
    List<InvestmentEntity> findByType(EnumAssetType type); // Busca filtrada por tipo
}
