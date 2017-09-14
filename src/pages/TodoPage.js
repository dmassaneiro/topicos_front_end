import React, { Component } from 'react';

import axios from 'axios';

import {
    Table, Button,
    Modal, ButtonGroup,
} from 'react-bootstrap';

import TodoForm from '../components/TodoForm';

class TodoPage extends Component {

    state = {
        todos: []
    }

    componentDidMount() {
        this.getTodos();
    }

    getTodos = () => {
        return axios.get('http://localhost:3001/todos')
                .then((response) => {
                    console.log(response);
                    this.setState({
                        todos: response.data
                    });
                }).catch((error) => {
                    console.error(error);
                })
    }

    onExcluirClick = (todo) => {
        const confirm = window.confirm("Deseja excluir a tarefa " + todo.id + "?");

        if (confirm) {
            const url = "http://localhost:3001/todos/" + todo.id;
            axios.delete(url)
                .then((response) => {
                    if (response.status == 200) {
                        return this.getTodos();
                    }
                }).catch((ex) => {
                    console.warn(ex);
                })
        }
    }

    renderTodo = () => {
        const todos = this.state.todos;

        const todosComponents = todos.map((todo, index) => {
            return (
                <tr>
                    <td>{todo.id}</td>
                    <td>{todo.title}</td>
                    <td>{todo.date}</td>
                    <td>{todo.completed}</td>
                    <td>
                        <ButtonGroup bsSize="small">
                            <Button bsStyle="warning">Editar</Button>
                            <Button bsStyle="danger"
                                onClick={() => this.onExcluirClick(todo)}>
                                Excluir
                            </Button>
                        </ButtonGroup>
                    </td>
                </tr>
            );
        });

        return todosComponents;
    }

    onNewTodoClick = () => {
        this.setState({ showForm: true })
    }

    onFormClose = () => {
        this.setState({ showForm: false })
    }

    onTodoSave = (title, description) => {
        const data = {
            title: title,
            description: description
        }

        axios.post('http://localhost:3001/todos/', data)
            .then((response) => {
                if (response.status === 201) {
                    this.setState({ showForm: false });
                    return this.getTodos();
                }
            }).catch((ex) => {
                console.warn(ex);
            })
    }

    render() {
        const todos = this.state.todos;
        const showForm = this.state.showForm;

        return (
            <section>
                <h1>Página de Tarefas</h1>

                <Button bsSize="small" bsStyle="success"
                    onClick={this.onNewTodoClick}>
                    Nova Tarefa
                </Button>

                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Título</th>
                            <th>Data</th>
                            <th>Concluída</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTodo()}
                    </tbody>
                </Table>

                <TodoForm showForm={showForm} onClose={this.onFormClose}
                    onSave={this.onTodoSave} />
            </section>
        );
    }
}

export default TodoPage;