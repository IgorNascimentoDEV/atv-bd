const readlineSync = require('readline-sync');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'agenda';
const collectionName = 'contatos';

async function main() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        console.log("Conectado ao MongoDB");

        while (true) {
            console.log("\nMenu:");
            console.log("1. Cadastrar contato");
            console.log("2. Consultar por nome");
            console.log("3. Consultar todos");
            console.log("4. Editar contato");
            console.log("5. Excluir contato");
            console.log("6. Sair");

            const choice = readlineSync.question("Escolha uma opcao: ");

            switch (choice) {
                case '1':
                    await cadastrarContato(collection);
                    break;
                case '2':
                    await consultarPorNome(collection);
                    break;
                case '3':
                    await consultarTodos(collection);
                    break;
                case '4':
                    await editarContato(collection);
                    break;
                case '5':
                    await excluirContato(collection);
                    break;
                case '6':
                    console.log("Saindo...");
                    return;
                default:
                    console.log("Opção inválida");
            }
        }
    } catch (error) {
        console.error("Erro:", error);
    } finally {
        await client.close();
    }
}

async function cadastrarContato(collection) {
    const nome = readlineSync.question("Digite o nome do contato: ");
    const telefone = readlineSync.question("Digite o numero de telefone: ");

    await collection.insertOne({ nome, telefone });
    console.log("Contato cadastrado com sucesso");
}

async function consultarPorNome(collection) {
    const nome = readlineSync.question("Digite o nome do contato: ");
    const query = { nome };
    const result = await collection.findOne(query);

    if (result) {
        console.log("Nome:", result.nome);
        console.log("Telefone:", result.telefone);
    } else {
        console.log("Contato nao encontrado");
    }
}

async function consultarTodos(collection) {
    const result = await collection.find().toArray();

    if (result.length > 0) {
        console.log("\nContatos:\n");
        result.forEach(contato => {
            console.log("Nome:", contato.nome);
            console.log("Telefone:", contato.telefone + "\n");
        });
    } else {
        console.log("Nenhum contato encontrado");
    }
}

async function editarContato(collection) {
    const nome = readlineSync.question("Digite o nome do contato que deseja editar: ");
    const query = { nome };
    const result = await collection.findOne(query);

    if (result) {
        console.log("Contato encontrado:");
        console.log("Nome:", result.nome);
        console.log("Telefone:", result.telefone);

        const campo = readlineSync.question("Digite o campo que deseja editar (nome ou telefone): ");
        const novoValor = readlineSync.question("Digite o novo valor: ");

        const updateQuery = { $set: { [campo]: novoValor } };
        await collection.updateOne(query, updateQuery);

        console.log("Contato editado com sucesso");
    } else {
        console.log("Contato não encontrado");
    }
}

async function excluirContato(collection) {
    const nome = readlineSync.question("Digite o nome do contato que deseja excluir: ");
    const query = { nome };
    const result = await collection.deleteOne(query);

    if (result.deletedCount > 0) {
        console.log("Contato excluído com sucesso");
    } else {
        console.log("Contato não encontrado");
    }
}

main();
