import '../css/App.css';

import React, { useState, useEffect } from 'react';
import SimpleLayout from '../components/Layouts/SimpleLayout';

import CustomButton from '../components/Buttons/CustomButton';
import TaskCard from '../components/Cards/TaskCard';
import { Link } from 'react-router-dom';


import { useSelector, useDispatch } from "react-redux";
import { counterActions } from "../store/counter";
import { fetchData } from "../store/tasks";


function AllAiTasks() {

  



    const handleClickAdd = () => {
        console.log('Add Button clicked!');
    };

    const dispatch = useDispatch();
    const counter = useSelector((state) => state.counter.counter);
    const show = useSelector((state) => state.counter.showCounter);
   
    const myStatus = useSelector((state) => state.tasks.status);
    const myData = useSelector((state) => state.tasks.data);
    const myError = useSelector((state) => state.tasks.status);

   

    // useEffect(() => {
    //     console.log('This is like componentDidMount');
    //     console.log(myStatus)
    //     dispatch(fetchData());
    // });

    console.log(myStatus)
    //dispatch(fetchData());
    if (myStatus==='idle'){
        dispatch(fetchData());
    }
    
    const incrementHandler = () => {
        dispatch(counterActions.increment());
    };

    const increaseHandler = () => {
        dispatch(counterActions.increase(10)); // { type: SOME_UNIQUE_IDENTIFIER, payload: 10 }
    };

    const decrementHandler = () => {
        dispatch(counterActions.decrement());
    };

    const toggleCounterHandler = () => {
        dispatch(counterActions.toggleCounter());
    };

    return (
        <SimpleLayout>
            <div className="container p-0">
                <div className="my-body">

                    <div>

                        {show && <div>{counter}</div>}
                        <button onClick={incrementHandler}>Increment</button>
                        <button onClick={increaseHandler}>Increase by 10</button>
                        <button onClick={decrementHandler}>Decrement</button>
                        <button onClick={toggleCounterHandler}>Toggle Counter</button>

                    </div>




                    <div className="row p-0 g-0 mb-3 mt-3">
                        <div className="col-12 d-flex justify-content-between">
                            <div className="my-body-title">
                                All AI Tasks
                            </div>
                            <Link to="/addTask">
                                <CustomButton onClick={handleClickAdd} disabled={false} name="add" />
                            </Link>
                        </div>
                    </div>
                    <div className="row p-0 g-2">
                        {myData.map(item => (
                            <div className="col-3" key={item.uuid}>
                                <TaskCard uuid={item.uuid} nameTask={item.name} nameApplication={item.application.name} nameModel={item.model.replace(".xml", "")} nameStatus={item.status}></TaskCard>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SimpleLayout>
    );
}

export default AllAiTasks;
