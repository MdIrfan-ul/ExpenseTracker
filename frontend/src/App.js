import {createBrowserRouter,RouterProvider} from "react-router-dom";
import { NavBar } from "./components/Nav/Nav";
import { Home } from "./components/Home/Home";
import { SignUp } from "./components/Signup/Signup";
import { SignIn } from "./components/SignIn/Signin";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./features/userReducer";
import { useEffect } from "react";
import { DashBoard } from "./Pages/DashBoard/DashBoard";
import ProtectedRoute from "./utils/Protected";
import { Transaction } from "./Pages/Transactions/Transactions";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Budget } from "./Pages/Budgets/Budgets";

function App() {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  const router = createBrowserRouter([
    {path:'/',element:<NavBar/>,children:[
    {index:true,element:<Home/>},
    {path:'/signup',element:<SignUp/>},
    {path:'/signin',element:<SignIn/>},
    {path:'/dashboard',element:
    <ProtectedRoute>
      <DashBoard/>
    </ProtectedRoute>
    },
    {path:'/transactions',element:
      <ProtectedRoute>
        <Transaction/>
      </ProtectedRoute>
    },{
      path:'/budgets',element:
      <ProtectedRoute>
        <Budget/>
      </ProtectedRoute>
    }
    ]}
  ]
)


  return (
    <div className="App">
      <ToastContainer/>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
