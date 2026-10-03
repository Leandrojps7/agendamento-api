const API_URL = "/api/agendamentos";

const form = document.getElementById("form-agendamento");
const mensagem = document.getElementById("mensagem");

document.addEventListener("DOMContentLoaded", carregarAgendamentos);

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const id = document.getElementById("id").value;

    const agendamento = {
        cliente: document.getElementById("cliente").value,
        telefone: document.getElementById("telefone").value,
        tipoManutencao: document.getElementById("tipoManutencao").value,
        data: document.getElementById("data").value,
        horario: document.getElementById("horario").value,
        descricao: document.getElementById("descricao").value,
        status: document.getElementById("status").value
    };

    try {
        const resposta = await fetch(id ? `${API_URL}/${id}` : API_URL, {
            method: id ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(agendamento)
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível salvar o agendamento.");
        }

        mostrarMensagem(id ? "Agendamento atualizado!" : "Agendamento cadastrado!", false);
        limparFormulario();
        await carregarAgendamentos();

    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
});

async function carregarAgendamentos() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar os agendamentos.");
        }

        const agendamentos = await resposta.json();
        const tabela = document.getElementById("tabela-agendamentos");

        tabela.innerHTML = "";

        agendamentos.forEach(agendamento => {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${agendamento.id}</td>
                <td>${escapar(agendamento.cliente)}</td>
                <td>${escapar(agendamento.telefone)}</td>
                <td>${escapar(agendamento.tipoManutencao)}</td>
                <td>${formatarData(agendamento.data)}</td>
                <td>${escapar(agendamento.horario)}</td>
                <td>${escapar(agendamento.status)}</td>
                <td>
                    <button class="edit" onclick="editar(${agendamento.id})">Editar</button>
                    <button class="delete" onclick="excluir(${agendamento.id})">Excluir</button>
                </td>
            `;

            tabela.appendChild(linha);
        });

    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}

async function editar(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`);

        if (!resposta.ok) {
            throw new Error("Agendamento não encontrado.");
        }

        const a = await resposta.json();

        document.getElementById("id").value = a.id;
        document.getElementById("cliente").value = a.cliente;
        document.getElementById("telefone").value = a.telefone;
        document.getElementById("tipoManutencao").value = a.tipoManutencao;
        document.getElementById("data").value = a.data;
        document.getElementById("horario").value = a.horario;
        document.getElementById("descricao").value = a.descricao || "";
        document.getElementById("status").value = a.status;

        document.getElementById("form-title").textContent = "Editar agendamento";
        document.getElementById("btn-salvar").textContent = "Atualizar";

        window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}

async function excluir(id) {
    if (!confirm("Deseja realmente excluir este agendamento?")) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível excluir o agendamento.");
        }

        mostrarMensagem("Agendamento excluído!", false);
        await carregarAgendamentos();

    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}

function limparFormulario() {
    form.reset();
    document.getElementById("id").value = "";
    document.getElementById("status").value = "Agendado";
    document.getElementById("form-title").textContent = "Novo agendamento";
    document.getElementById("btn-salvar").textContent = "Cadastrar";
}

function mostrarMensagem(texto, erro) {
    mensagem.textContent = texto;
    mensagem.className = erro ? "erro" : "sucesso";

    setTimeout(() => {
        mensagem.textContent = "";
    }, 3000);
}

function formatarData(data) {
    if (!data) return "";
    const partes = data.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function escapar(valor) {
    if (valor === null || valor === undefined) return "";
    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
