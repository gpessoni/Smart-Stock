const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    await prisma.TypeProducts.deleteMany({});
    await prisma.groupProduct.deleteMany({});
    await prisma.unitOfMeasure.deleteMany({});
    await prisma.storage.deleteMany({});
    await prisma.departments.deleteMany({});

    const typeData = [
        { description: "Mercadoria para Revenda" },
        { description: "Matéria-Prima" },
        { description: "Embalagem" },
        { description: "Produto em Processo" },
        { description: "Produto Acabado" },
        { description: "Subproduto" },
        { description: "Produto Intermediário" },
        { description: "Material de Uso e Consumo" },
        { description: "Ativo Imobilizado" },
    ];

    const groupData = [
        { code: "01", description: "Eletrônicos" },
        { code: "02", description: "Roupas" },
        { code: "03", description: "Alimentos" },
        { code: "04", description: "Móveis" },
        { code: "05", description: "Ferramentas" },
        { code: "06", description: "Beleza e Cuidados Pessoais" },
        { code: "07", description: "Esportes e Lazer" },
        { code: "08", description: "Livros" },
        { code: "09", description: "Medicamentos" },
        { code: "10", description: "Brinquedos" },
        { code: "11", description: "Automotivo" },
        { code: "12", description: "Casa e Jardim" },
        { code: "13", description: "Pets" },
        { code: "14", description: "Eletrodomésticos" },
        { code: "15", description: "Instrumentos Musicais" },
        { code: "16", description: "Hardware e Acessórios" },
        { code: "17", description: "Oficina e Construção" },
        { code: "18", description: "Acessórios de Moda" },
        { code: "19", description: "Saúde e Bem-Estar" },
        { code: "20", description: "Arte e Artesanato" },
        { code: "21", description: "Papéis e Escritório" },
        { code: "22", description: "Produtos Sustentáveis" },
        { code: "23", description: "Colecionáveis" },
        { code: "25", description: "Gastronomia e Bebidas" },
        { code: "26", description: "Materiais de Construção" },
        { code: "27", description: "Equipamentos de Segurança" },
        { code: "28", description: "Decoração" },
        { code: "29", description: "Hobbies e Entretenimento" },
        { code: "30", description: "Eletroportáteis" },
    ];

    const unitData = [
        { abbreviation: "UN", description: "Unidade" },
        { abbreviation: "KG", description: "Quilograma" },
        { abbreviation: "LT", description: "Litro" },
        { abbreviation: "MT", description: "Metro" },
        { abbreviation: "CM", description: "Centímetro" },
        { abbreviation: "MM", description: "Milímetro" },
        { abbreviation: "M2", description: "Metro Quadrado" },
        { abbreviation: "M3", description: "Metro Cúbico" },
        { abbreviation: "PC", description: "Peça" },
        { abbreviation: "PCT", description: "Pacote" },
        { abbreviation: "LBS", description: "Libras" },
        { abbreviation: "FT", description: "Pé" },
        { abbreviation: "GL", description: "Galão" },
        { abbreviation: "QT", description: "Quart" },
    ];

    for (const type of typeData) {
        await prisma.TypeProducts.create({
            data: type,
        });
    }

    console.log("Tipos de produtos inseridos com sucesso!");

    for (const group of groupData) {
        await prisma.GroupProduct.create({
            data: group,
        });
    }

    console.log("Grupos de produtos inseridos com sucesso!");

    for (const unit of unitData) {
        await prisma.unitOfMeasure.create({
            data: unit,
        });
    }

    console.log("Unidades de medida inseridas com sucesso!");


    const storageData = [
        { code: "01", description: "Almoxarifado Central" },
        { code: "02", description: "Armazém Secundário" },
        { code: "03", description: "Depósito de Materiais Perigosos" },
        { code: "04", description: "Armazém de Produtos Acabados" },
        { code: "05", description: "Armazém de Produtos Intermediários" },
        { code: "06", description: "Armazém de Embalagens" },
        { code: "07", description: "Depósito de Resíduos" },
        { code: "08", description: "Armazém de Matéria-Prima" },
        { code: "09", description: "Armazém de Componentes Eletrônicos" },
        { code: "10", description: "Armazém de Equipamentos" },
        { code: "11", description: "Armazém de Ferramentas" },
        { code: "30", description: "Armazém de Produção" }
    ];

    for (const storage of storageData) {
        await prisma.storage.create({
            data: storage
        });
    }

    console.log("Armazéns inseridos com sucesso!");


    const departmentData = [
        { description: "Vendas" },
        { description: "Marketing" },
        { description: "TI" },
        { description: "Recursos Humanos" },
        { description: "Financeiro" },
        { description: "Logística" },
        { description: "Produção" },
        { description: "Pesquisa e Desenvolvimento" },
        { description: "Manutenção" },
        { description: "Qualidade" },
    ];


    for (const department of departmentData) {
        await prisma.departments.create({
            data: department,
        });
    }

    console.log("Departamentos inseridos com sucesso!");

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });