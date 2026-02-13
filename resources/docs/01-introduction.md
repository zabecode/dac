# Introdução

Bem-vindo à documentação da API. Este sistema fornece uma API REST segura com autenticação via API Keys, permissões por módulo e identificação de clientes.

## Visão Geral

- **Autenticação**: Todas as requisições à API devem incluir uma API Key válida via Bearer Token
- **Identificador**: Cada chave possui um identificador (cliente, empresa) que é carregado no contexto para escopar dados
- **Permissões**: As chaves são configuradas com permissões granulares por módulo do sistema
- **Expiração**: Chaves podem ter data de expiração configurável

## Base URL

```
https://seu-dominio.com/api/v1
```

## Formato de Resposta

Todas as respostas são retornadas em formato JSON.

```json
{
  "data": { ... },
  "message": "Operação realizada com sucesso"
}
```

## Códigos HTTP

| Código | Significado                                   |
| ------ | --------------------------------------------- |
| 200    | Sucesso                                       |
| 201    | Recurso criado                                |
| 400    | Requisição inválida                           |
| 401    | Não autenticado (API Key inválida ou ausente) |
| 403    | Sem permissão para o módulo                   |
| 404    | Recurso não encontrado                        |
| 422    | Erro de validação                             |
| 429    | Rate limit excedido                           |
| 500    | Erro interno                                  |
