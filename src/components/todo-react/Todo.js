import React, { useState, useEffect } from 'react';
import img from '../../images/todo.svg';
import axios from 'axios';
import "./style.css";

function Todo() {
    const [inputdata, setInputData] = useState("");
    const [items, setItems] = useState([]);
    const [isEditItem, setIsEditItem] = useState("");
    const [toggleButton, setToggleButton] = useState(false);
    const [updatedItem, setUpdatedItem] = useState(true);

    // Adding an Items to the list
    const addItems = async () => {
        if (!inputdata) {
            alert('please fill the list');
        }
        else if (inputdata && toggleButton) {
            const editedItem = {
                "name": inputdata,
            }
            let editId = items.filter((item) => item._id === isEditItem)
            editId = editId[0]._id;
            try {
                const res = await axios.patch(`https://todolist-backend-ankit345.onrender.com/api/v1/products/${editId}`, editedItem, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                console.log("res: ", res.data);
                setUpdatedItem(true);
                setInputData([]);           // It resets the input element.
                setIsEditItem(null);        // It removes the edit item from the input
                setToggleButton(false);     // It removes the edit button from the input

            } catch (err) {
                console.log("Error: ", err);
            }
        }

        else {
            const myNewInputData = {
                name: inputdata
            }
            try {
                const res = await axios.post('https://todolist-backend-ankit345.onrender.com/api/v1/products', myNewInputData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                console.log("Response: ", res.data);
                setUpdatedItem(true);
                setInputData("");
            } catch (err) {
                console.log("Error: ", err);
            }
        }
    };

    // GET ALL THE ITEMS
    const getAllItems = async () => {
        try {
            const res = await axios.get('https://todolist-backend-ankit345.onrender.com/api/v1/products');
            if (res.status === 204) {
                setItems([]);
            } else if (res.status === 200) {
                setItems(res.data.products);
            }
        } catch (err) {
            console.log("Error: ", err);
        }
    }

    useEffect(() => {
        if (updatedItem) {
            getAllItems();
            setUpdatedItem(false);
            console.log(items);
        }
        // console.log(updatedItem);               
    }, [items, updatedItem])                                                      // 


    // Deleting an item from the list
    const deleteItems = async (index) => {
        let deletionId = items.filter((item) => item._id === index);
        deletionId = deletionId[0]._id;
        try {
            const res = await axios.delete(`https://todolist-backend-ankit345.onrender.com/api/v1/products/${deletionId}`);
            console.log("response: ", res.data);
            setUpdatedItem(true);
        } catch (err) {
            console.log("Error: ", err);
        }
    }

    // Edit the list items
    const editItem = (index) => {
        const item_todo_edited = items.find((currEle) => {
            return currEle._id === index
        })
        setInputData(item_todo_edited.name);
        setIsEditItem(index);            // To pass the id of the matched element.
        setToggleButton(true);           // To change the icon from addition to edit.
    }

    // Delete all the list items
    const allClear = async () => {
        try {
            const res = await axios.delete('https://todolist-backend-ankit345.onrender.com/api/v1/products');
            console.log("res: ", res);
            setUpdatedItem(true);
        } catch (err) {
            console.log("Error: ", err);
        }
    }

    return (
        <>
            <div className="main-div">
                <div className="child-div">
                    <figure>
                        <img src={img} alt="todologo" />
                        <figcaption>Add Your List Here ✌</figcaption>
                    </figure>
                    <div className="addItems">
                        <input type="text" placeholder='✍ Add Items' className='form-control' value={inputdata} onChange={(e) => setInputData(e.target.value)} />

                        {/* If toggleButton is on => then edit button will shown,  Otherwise add button is shown*/}
                        <i className={`fa fa-solid fa-${toggleButton ? 'edit' : 'plus'} add-btn`} onClick={() => addItems()}></i>
                    </div>

                    <div className="showItems">
                        {items.length !== 0 ?
                            items.map((currEle) => {
                                return (
                                    <div className="eachItem" key={currEle._id}>
                                        <h3>{currEle.name}</h3>
                                        <div className="todo-btn">
                                            <i className="far fa-solid fa-edit add-btn" onClick={() => editItem(currEle._id)}></i>
                                            <i className="far fa-solid fa-trash-alt add-btn" onClick={() => deleteItems(currEle._id)}></i>
                                        </div>
                                    </div>
                                )
                            }) :
                            <span className='error'>There is no task to display</span>
                        }
                    </div>

                    {

                        items.length === 0 ?
                            '' :
                            <div className="showItems">
                                <button className='btn effect04' data-sm-link-text="Remove All" onClick={() => allClear()} >
                                    <span>CheckList</span>
                                </button>
                            </div>
                    }

                </div>
            </div>
        </>
    )
}

export default Todo