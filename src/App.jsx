import React from 'react'
import { Route, Routes } from 'react-router'
import RegisterScreen from './Screens/RegisterScreen/RegisterScreen'
import { LoginScreen } from './Screens/LoginScreen/LoginScreen'
import AuthMiddleware from './Middlewares/AuthMiddlewares.jsx'
import ChatScreen from './slack/Screens/ChatScreen/ChatScreen.jsx'
import WorkspaceListScreen from './slack/Screens/WorkspaceListScreen/WorkspaceListScreen.jsx'
import { ResetPasswordScreen } from './Screens/ResetPasswordScreen/ResetPasswordScreen.jsx'

function App() {

  return (

    <Routes>
      <Route path='/' element={<RegisterScreen/>} />
      <Route path='/login' element={<LoginScreen/>} />
      <Route path='/register' element={<RegisterScreen/>} />
      <Route element={<AuthMiddleware/>}>
      <Route path='/workspace/:workspace_id' element = {<ChatScreen/>}/>
      <Route path='/home' element={<WorkspaceListScreen />}/>
      </Route>
      <Route path='/reset-password' element={<ResetPasswordScreen/>} />
    </Routes>

  )
}

export default App 



