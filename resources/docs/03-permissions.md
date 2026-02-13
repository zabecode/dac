# Permissões

O sistema utiliza permissões baseadas em **módulos**. Cada API Key pode ser configurada com acesso a um ou mais módulos.

## Módulos Disponíveis

| Módulo        | Slug        | Descrição                         |
| ------------- | ----------- | --------------------------------- |
| Dashboard     | `dashboard` | Acesso ao dashboard               |
| Usuários      | `users`     | Gerenciamento de usuários         |
| Chaves de API | `api-keys`  | Gerenciamento de chaves de API    |
| Dispositivos  | `devices`   | Gerenciamento de dispositivos IoT |
| Sensores      | `sensors`   | Gerenciamento de sensores         |
| Leituras      | `readings`  | Acesso a leituras de sensores     |

## Como Funciona

1. Ao criar uma API Key, selecione os módulos necessários
2. Cada requisição à API verifica se a chave possui permissão para o módulo acessado
3. Caso a chave não tenha permissão, a resposta será `403 Forbidden`

**Exemplo**: Uma chave com permissão `devices` pode acessar `GET /api/v1/devices`, mas NÃO pode acessar `GET /api/v1/sensors`.

## Multi-tenancy por Identifier

O campo `identifier` da API Key define o escopo de dados. Todos os registros de devices, sensors e readings são automaticamente filtrados pelo identifier da chave usada.

```
API Key: "Empresa X" (identifier)
  → GET /api/v1/devices → Retorna apenas dispositivos da "Empresa X"
  → POST /api/v1/devices → Cria dispositivo associado à "Empresa X"
```

## Verificação Automática

A verificação de permissão é feita automaticamente pelo middleware `apiAuth`. Cada controller verifica a permissão do módulo antes de executar a operação:

```
Requisição → apiAuth middleware → Permissão do módulo → Controller
```

## Boas Práticas

- **Princípio do menor privilégio**: conceda apenas as permissões necessárias
- **Uma chave por ambiente**: crie chaves separadas para produção e staging
- **Rotação periódica**: revogue e recrie chaves regularmente
- **Expiração**: sempre que possível, defina uma data de expiração
- **Identifier por cliente**: cada cliente/empresa deve ter seu próprio identifier
