import React from "react";
import ReactDOM from "react-dom";
import db from "./firebase";
import "./styles.css";
import { isNullOrUndefined } from "util";
import { PassThrough } from "stream";

//console.log(db);

function App() {
  let [todos, setTodos] = React.useState([]);
  let [txt, setTxt] = React.useState("");
  let [loading, setLoading] = React.useState(false);

  async function loadTodos() {
    setLoading(true);
    let snapshot = await db
      .collection("todos")
      .orderBy("created_at", "asc")
      .get();
    //console.log(snapshot.docs);
    //snapshot.docs.forEach(v => console.log(v.data()));
    setTodos(snapshot.docs);
    setLoading(false);
  }

  async function onSubmit() {
    if (txt.length != 0) {
      let newObj = { txt, created_at: new Date().getTime(), isDone: false };
      await db.collection("todos").add(newObj);

      loadTodos();
      setTxt("");
    }
  }
  async function isDone(id) {
    let clone = {};
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id === id) {
        clone = todos[i].data();
        await db
          .collection("todos")
          .doc(id)
          .delete();
        break;
      }
    }
    clone.isDone = !clone.isDone;
    await db.collection("todos").add(clone);
    loadTodos();
  }

  async function deleteTodo(id) {
    await db
      .collection("todos")
      .doc(id)
      .delete();
    loadTodos();
  }

  React.useEffect(() => {
    loadTodos();
  }, []);

  let done = {
    textDecoration: "line-through"
  };

  let undone = {
    background: "red"
  };

  if (loading) return <div>loading...</div>;

  return (
    <div>
      <div>
        {todos.map(v => (
          <div style={v.data().isDone ? done : undone} key={v.id}>
            {v.data().txt}
            <button onClick={() => isDone(v.id)}>DONE</button>
            <button onClick={() => deleteTodo(v.id)}>DELETE</button>
          </div>
        ))}
      </div>
      <div>
        <form
          onSubmit={event => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <input
            type="text"
            value={txt}
            onChange={event => setTxt(event.target.value)}
          />
          <button>ADD</button>
        </form>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
