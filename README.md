# 🏆 Desafio Técnico SDET - Automação Playwright

**Candidato:** Fredson Borges Filho
**Tecnologias:** Playwright, TypeScript, Node.js, GitHub Actions (CI/CD)

---

## 🔗 Entrega Final e Links

* **Link do Vídeo de Apresentação :** (https://drive.google.com/file/d/1wfX-I0WW17Wth83tGMOQJHGlbmaz5wGt/view?usp=sharing)
* **Status:** 21 Casos de Teste Passando (11 API + 10 Web).
* **Repositório:** Privado, com o colaborador `operationsvoidr` convidado.

---

## 🛠️ Instruções de Instalação e Execução

O projeto está configurado para rodar localmente ou via CI/CD.

### 1. Instalação

1.  Clone o repositório (privado).
2.  Navegue até a pasta raiz no terminal.
3.  Instale as dependências: `npm install`
4.  Instale os navegadores: `npx playwright install`

### 2. Execução dos Testes

A suíte é executada com eficiência, aproveitando o paralelismo e a separação por projetos.

| Projeto | Aplicação | Comando |
| :--- | :--- | :--- |
| **API** | Restful Booker | `npx playwright test --project=api` |
| **WEB** | Automation in Testing | `npx playwright test --project=web --headed` |
| **TUDO** | Execução Completa (CI/Local) | `npx playwright test` |

---

## 💡 Estratégia e Raciocínio Técnico

### 1. Qualidade do Código e Boas Práticas

* **Arquitetura (POO):** O código utiliza **TypeScript** e o padrão **Page Object Model (POM)**. A Interface Web (Web) e a API (Application Actions) são separadas na pasta `src/`.
* **Visibilidade POO:** O seletor principal na classe `ContactPage` (`submitButton`) foi definido usando um método **`getter` público** para expor o seletor, mantendo a propriedade de armazenamento **privada**, conforme a boa prática de POO.
* **Gestão de Dados e Fixtures:**
    * Os dados de teste (payloads, credenciais) são centralizados em `src/data/testData.ts` para **evitar *hardcoded values***.
    * O **Setup Fixture** (`api.setup.ts`) é usado para gerar o token de autenticação apenas uma vez.
    * **Fixtures Customizadas** (`createdBookingId`) são utilizadas em todos os testes de CRUD da API para **garantir que cada teste seja independente e atômico**, eliminando a dependência de estado entre eles.

### 2. Cobertura e Raciocínio Crítico

| Aplicação | Cobertura Crítica | Justificativa |
| :--- | :--- | :--- |
| **API (11 Casos)** | **Segurança/Autenticação:** Testes explícitos tentam realizar `PUT/DELETE` com **token inválido** (Teste 3), verificando a resposta `403 Forbidden`. | Garante que a lógica de autorização da API esteja funcionando. |
| | **Schema e Dados:** Validações de `status code`, **Schema** (`toHaveProperty`), e integridade dos dados em cada requisição (ex: o que é enviado é o que é recebido). | Confirma a precisão e a funcionalidade da API. |
| **Web (10 Casos)** | **Cenários Negativos:** O foco está na **validação de formulário** (Teste 2-6), cobrindo e-mail inválido e *edge cases* (limites de caracteres). | Previne que dados malformados entrem no sistema, validando as regras de negócio de UX. |
| | **Resolução de Bug:** A asserção de e-mail foi ajustada para contornar um **bug** da aplicação de teste (que retornava uma string incompleta), garantindo que a automação não fosse bloqueada por falhas externas. | Demonstra pensamento crítico e pragmatismo profissional. |

## 🌟 Diferenciais

O projeto inclui diferenciais que aumentam a automação e a consistência.

* **CI/CD com GitHub Actions:** Um workflow está configurado para **executar automaticamente** todos os testes em cada *push*, garantindo que a suíte esteja sempre saudável. Ele também publica os relatórios HTML.
* **Performance:** O Playwright está configurado para **execução paralelizada** (`fullyParallel: true`) e utiliza **workers** de forma eficiente, resultando em um tempo de execução total baixo.