import React from 'react';
import { Link } from 'react-router-dom';
import './styles/StartPage.css';
import { useAuth } from './AuthContext';
import Chat from './chat/Chat';


function StartPage() {
    const { authState } = useAuth();
   
    return (
      <div>
<nav>
        <ul>
          {
           authState.role.includes('ADMIN') &&
         (
            <>
              <li><Link to="/register">Add User</Link></li>
              <li><Link to="/person">Person</Link></li>
              <li><Link to="/device">Device</Link></li>
              <li><Link to="/device/create">Create Device</Link></li>
            </>
          )}
        </ul>
      </nav>
    <Chat senderId={authState.id} />
      </div>
    )

}

export default StartPage;
