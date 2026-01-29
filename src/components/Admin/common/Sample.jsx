import axios from "axios";
import { useEffect, useState } from "react";

const Sample = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [todos, setTodos] = useState([]); 
  const[count,setCount]=useState(0)
  const[apiData,setApiData]=useState([])
  const[query,setQuery]=useState("");

    const handleIncrement =()=>{
      setCount(count+1)
    }

    const handleDecrement=()=>{
      setCount(count-1)
    }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill both fields!");
      return;
    }

    setTodos([...todos, formData]); // add todo to list
    setFormData({ title: "", content: "" }); // reset form
  };


  useEffect(()=>{
   const getData=async()=>{
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
      setApiData(response.data)
    } catch (error) {
    }
   }
   getData();
  },[])

  const filterData = apiData.filter(u=>{
    return (
      u.title.toLowerCase().includes(query.toLowerCase()) ||
      u.body.toLowerCase().includes(query.toLowerCase()) ||
      String(u.id).toLowerCase().includes(query.toLowerCase())
      )
  })

  return (
    <div>
      <div className="todo-application">
      <h1>To-Do List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          style={{border:'solid black 2px'}}
        />
        <input
          type="text"
          placeholder="Enter content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          style={{border:'solid black 2px'}}
        />
        <button type="submit" style={{border:'solid black 2px'}}>Add Task</button>
      </form>

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            <strong>{todo.title}</strong>: {todo.content}
          </li>
        ))}
      </ul>
      </div>

      <div className="counter application">
      <button onClick={handleIncrement} >+</button>
      <p>{count}</p>
      <button onClick={handleDecrement} disabled={count===0}>-</button>
      </div>



    <input type="text" value={query} onChange={(e)=>setQuery(e.target.value)}/>
        {/* data comes from Api */}
      <div className="APi Data">
          {
            filterData.slice(0,10).map((product,index)=>(
              <ul key={index} className="border border-amber-600 text-center">
                <li>ID:-{product.id}</li>
                <li>TITLE:-{product.title}</li>
                <li>BODY:-{product.body}</li>
              </ul>
            ))
          }
      </div>
    </div>
  );
};

export default Sample;
