# 💼 WalletWise
Aplicação de gerenciamento de uma carteira de investimentos, permitindo o cadastro e controle de ativos financeiros como Ações, Criptomoedas, FIIs, Renda Fixa e outros. Desenvolvida na discplina de **CSI607 - Sistemas Web II**.

## 🛠 Tecnologias Utilizadas
- Java
- Spring Boot
- Spring Web
- Docker
- PostgreSQL
- React.js
- Spring JPA

## 🚀 Como Executar
Certifique-se de ter o Docker e Java instalado.

1. Backend:
```bash
# Navegue até a pasta do docker
cd docker

# Execute o container do banco de dados (se usar Docker)
docker-compose up -d

# Navegue até a pastar do server
cd investments

# Inicie a aplicação Spring Boot
./mvnw spring-boot:run
```
2. Frontend:
```bash
# Navegue até a pasta web
cd investments-web

# Instale as dependências
npm install

# Inicie o painel
npm run dev
```

## 📡 Endpoints e Funcionalidades da API
| Método | Endpoint                       | Descrição                                 |
|--------|--------------------------------|--------------------------------------------|
| POST   | /investments                   | Cadastrar um novo ativo                   |
| GET    | /investments                   | Listar todos os ativos                    |
| GET    | /investments?type=CRIPTO       | Filtrar por tipo de ativo                 |
| PUT    | /investments/{id}              | Atualizar informações de um ativo         |
| DELETE | /investments/{id}              | Remover um ativo da carteira              |
| PATCH  | /investments/{id}/market-price | Atualizar o preço atual de mercado        |
| GET    | /investments/summary           | Obter resumo da carteira                  |
