import './css/App.css';
import './css/typography.css';
import AllAiTasks from './pages/AllAiTasks';
import AiInference from './pages/AiInference';
import AddAiTask from './pages/AddAiTask';
import EditAiTask from './pages/EditAiTask';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import { useRoutes } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { fetchData } from "./store/tasks";
import log from "./utils/console";


function App() {

    log(`--- react app start ---`)
   
    let element = useRoutes([
        {
            path: "/",
            element: <AllAiTasks />
        },
        {
            path: "inference/:uuid",
            element: <AiInference />
        },
        {
            path: "addTask",
            element: <EditAiTask />
        },
        {
            path: "editTask/:uuid/:from",
            element: <EditAiTask />
        },
        {
            path: "admin",
            element: <Admin />
        },
        {
            path: "*",
            element: <NotFound />
        },
    ]);

    return element;
}


export default App;
