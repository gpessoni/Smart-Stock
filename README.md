SmartStock
==========

O **SmartStock** é um sistema de gestão de estoque desenvolvido para atender pequenas e médias empresas que buscam uma solução eficiente, intuitiva e acessível para o gerenciamento de seus estoques e almoxarifado. Com foco em simplicidade e funcionalidades completas, o SmartStock ajuda a otimizar processos operacionais e a reduzir erros comuns em sistemas menos robustos ou controles manuais, como planilhas.

Documentação da API
-------------------

*   **Swagger**: [Acesse aqui](https://app.swaggerhub.com/apis/PESSONIGS/SmartStock/1.0.0#/)
    
*   **Postman**: [Visualize aqui](https://documenter.getpostman.com/view/39038855/2sAY518KyZ)
    

Tecnologias Utilizadas
----------------------

*   **Next.js**: Framework de desenvolvimento web com React.
    
*   **Prisma**: ORM para manipulação e interação com o banco de dados.
    
*   **Docker**: Ferramenta para containerização, garantindo consistência em ambientes de desenvolvimento e produção.
    
*   **PostgreSQL**: Banco de dados relacional utilizado para armazenamento de dados.
    

Como Iniciar o Projeto
----------------------

1.  bashCopiar códigogit clone cd SmartStocknpm install
    
2.  bashCopiar códigodocker-compose up
    
3.  bashCopiar códigonpx prisma migrate dev
    
4.  bashCopiar códigonpm run dev# ouyarn dev# oupnpm dev# oubun dev
    
5.  **Acessar a aplicação**: Abra [http://localhost:3000](http://localhost:3000) no seu navegador.
    

Estrutura do Projeto
--------------------

A página principal pode ser editada em app/page.tsx. As alterações são aplicadas automaticamente enquanto você desenvolve.

Este projeto utiliza [next/font](https://nextjs.org/docs/basic-features/font-optimization) para otimizar e carregar fontes personalizadas, como o Google Font "Inter".

Funcionalidades Principais
--------------------------

*   **Gerenciamento de Produtos**: Organização dos produtos por tipo, grupo e unidade de medida.
    
*   **Endereços de Armazenamento**: Controle detalhado de saldos em diferentes locais do almoxarifado.
    
*   **Sistema de Inventário**: Registro e processamento de inventários de produtos.
    
*   **Solicitações de Estoque**: Movimentação e controle de produtos desde a solicitação até a separação e entrega.
    
*   **Transferências Internas**: Realização de transferências entre diferentes endereços de armazenamento com rastreamento completo.
    

Benefícios do Sistema
---------------------

O **SmartStock** foi projetado para atender às demandas de gestão de estoque de pequenas e médias empresas, onde soluções simples como planilhas se tornam inadequadas à medida que a complexidade e o volume de dados aumentam. Com o SmartStock, é possível:

*   Reduzir erros operacionais.
    
*   Melhorar a eficiência na gestão de estoque.
    
*   Controlar de forma centralizada entradas e saídas de produtos.
    
*   Facilitar a integração com outras plataformas e ferramentas empresariais.
    

Deploy
------

A forma mais fácil de implantar uma aplicação Next.js é utilizando a [plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), criada pelos desenvolvedores do Next.js. Para mais detalhes sobre como fazer o deploy, consulte a [documentação de deploy do Next.js](https://nextjs.org/docs/deployment).

Aprenda Mais
------------

Para saber mais sobre o Next.js, confira os seguintes recursos:

*   [Documentação do Next.js](https://nextjs.org/docs) – informações detalhadas sobre recursos e API do Next.js.
    
*   [Tutorial interativo de Next.js](https://nextjs.org/learn) – aprenda Next.js de forma prática e interativa.
    

Visite também o [repositório do Next.js no GitHub](https://github.com/vercel/next.js) para contribuições e feedback.
