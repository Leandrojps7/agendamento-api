package com.leandro.agendamento.service;

import com.leandro.agendamento.model.Agendamento;
import com.leandro.agendamento.repository.AgendamentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AgendamentoService {

    private final AgendamentoRepository repository;

    public AgendamentoService(AgendamentoRepository repository) {
        this.repository = repository;
    }

    public List<Agendamento> listarTodos() {
        return repository.findAll();
    }

    public Optional<Agendamento> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Agendamento salvar(Agendamento agendamento) {
        return repository.save(agendamento);
    }

    public Optional<Agendamento> atualizar(Long id, Agendamento dados) {
        return repository.findById(id).map(agendamento -> {
            agendamento.setCliente(dados.getCliente());
            agendamento.setTelefone(dados.getTelefone());
            agendamento.setTipoManutencao(dados.getTipoManutencao());
            agendamento.setData(dados.getData());
            agendamento.setHorario(dados.getHorario());
            agendamento.setDescricao(dados.getDescricao());
            agendamento.setStatus(dados.getStatus());
            return repository.save(agendamento);
        });
    }

    public boolean excluir(Long id) {
        if (!repository.existsById(id)) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }
}
