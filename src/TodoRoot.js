// @flow
import React, { Component } from "react";
const rootId = 0;
let nextId = rootId;

type todo = {
  id: number,
  childIds: number[],
  text: string
};

type todoToAdd = {
  parentId: number,
  text: string
};

type todos = {
  [id: number]: todo
};
type TodoRoot_state = {
  todos: todos
};

class TodoRoot extends Component<{}, TodoRoot_state> {
  state = {
    todos: {
      [rootId]: {
        id: rootId,
        text: "Welcome to todo inception",
        childIds: []
      }
    }
  };

  addTodo = (data: todoToAdd) => {
    this._addTodo(data);
  };

  _getNextId() {
    return ++nextId;
  }

  _updateTodos(todos: todos) {
    this.setState((prevState, props) => {
      return { todos };
    });
  }

  _addTodo(data: todoToAdd) {
    let { parentId, text } = data;
    let id = this._getNextId();
    const { todos } = this.state;

    const getUpdatedParentTodo = () => {
      let parentTodo = todos[parentId] || {};
      let childIds = parentTodo.childIds || [];
      childIds = [...childIds, id];
      parentTodo = { ...parentTodo, childIds };
      return parentTodo;
    };
    const genNewTodo = () => {
      let newTodo = {
        id,
        text,
        childIds: []
      };
      return newTodo;
    };

    const parentTodo = getUpdatedParentTodo();
    const newTodo = genNewTodo();

    let updatedTodos = { ...todos, [id]: newTodo, [parentId]: parentTodo };
    this._updateTodos(updatedTodos);
  }

  render() {
    return (
      <div>
        <TodosList
          id={rootId}
          todos={this.state.todos}
          addTodo={this.addTodo}
        />
      </div>
    );
  }
}

type TodosList_props = {
  id: number,
  todos: todos,
  addTodo: (todo: todoToAdd) => void
};
type TodosList_state = {
  text: string
};
class TodosList extends Component<TodosList_props, TodosList_state> {
  state = {
    text: ""
  };
  handleChange = text => {
    this.updateText(text);
  };

  handleSubmit = (e: Event) => {
    e.preventDefault();
    this.onAddTodo();
  };
  updateText(text) {
    this.setState((prevState, props) => {
      return { text };
    });
  }
  clearTextInput() {
    this.updateText("");
  }
  onAddTodo = () => {
    const { id, addTodo } = this.props;
    const { text } = this.state;
    let data: todoToAdd = {
      parentId: id,
      text
    };
    addTodo(data);
    this.clearTextInput();
  };

  render() {
    const { id, todos } = this.props;
    let todo = todos[id] || {};
    let childIds = todo.childIds || [];
    return (
      <div>
        <h3> In-Dream : {id}</h3>
        <ul>
          <li>
            <form onSubmit={this.handleSubmit}>
              <input
                placeholder="Plant a seed. ;) "
                type="text"
                value={this.state.text}
                onChange={e => {
                  this.handleChange(e.target.value);
                }}
              />
              <button type="submit">Add</button>
            </form>
          </li>{" "}
          {childIds.map(eachId => {
            return (
              <li key={eachId}>
                <TodoItem
                  id={eachId}
                  todos={todos}
                  addTodo={this.props.addTodo}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

type TodoItem_props = {
  id: number,
  todos: todos,
  addTodo: (todo: todoToAdd) => void
};
type TodoItem_state = {
  isSubTodoOpen: boolean
};
class TodoItem extends Component<TodoItem_props, TodoItem_state> {
  state = {
    isSubTodoOpen: false
  };

  toggleSubTodo = () => {
    this.setState((prevState, props) => {
      return { isSubTodoOpen: !prevState.isSubTodoOpen };
    });
  };

  subTodosRender = () => {
    const { isSubTodoOpen } = this.state;
    if (!isSubTodoOpen) {
      return null;
    }

    return <TodosList {...this.props} />;
  };

  render() {
    const { id, todos } = this.props;
    const item = todos[id];
    const { isSubTodoOpen } = this.state;
    const levelBtnStatusText = (() => {
      if (isSubTodoOpen) {
        return "Out";
      }
      return "In";
    })();
    return (
      <div>
        {" "}
        <span>
          {" "}
          <b>{id} :</b> {item.text}
        </span>{" "}
        <button onClick={this.toggleSubTodo}>Level {levelBtnStatusText}</button>
        {this.subTodosRender()} <br />
      </div>
    );
  }
}
export default TodoRoot;
