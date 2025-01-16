import React, { useEffect, useState } from 'react';
import { getPersons, deletePersonLinking, deletePerson } from '../services/personService';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Table.css';


function Person() {
    const [persons, setPersons] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
  
    useEffect(() => {
    
      async function fetchPersons() {
        try {
          const personsData = await getPersons();
          console.log('Fetched persons:', personsData);  // Log to check response
          if (Array.isArray(personsData)) {
            setPersons(personsData);  // Set data if it's an array
          } else {
            setError('Unexpected data format received.');
          }
        } catch (error) {
          console.error('Error fetching persons:', error);
          setError('Failed to fetch persons data.');
        }
      }
  
      fetchPersons();
    }, []);


    const handleDeletePerson = async (id) => {
      try {
          await deletePersonLinking(id);  
          
          await deletePerson(id);  
  
          alert('Person deleted successfully');
          
          setPersons(persons.filter((person) => person.id !== id));
      } catch (error) {
          console.error('Failed to delete person:', error);
          setError('Failed to delete person.');
      }
  };
  
    if (error) {
      return <p>{error}</p>; 
    }
  
    return (
      <div>
        <h1>Person List</h1>

        <div className="buttons">
        <button className='backButton' onClick={() => navigate('/StartPage')} style={{ marginBottom: '20px' }}>
          BACK
        </button>

        <button className='backButton' onClick={() => navigate('/register')} style={{ marginBottom: '20px' }}>
          CREATE NEW USER
        </button>
        </div>
        

        {persons.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                {/* <th>Age</th> */}
                {/* <th>Password</th> */}
                <th>Email</th>
                <th>Role</th>
                <th>Actiosn</th>
              </tr>
            </thead>

            <tbody>
              {persons.map((person) => (
                <tr key={person.id}>
                  <td>
                    <Link to={`/person/${person.id}`}>{person.name}</Link> {/*goes to the details of a person page to make edits*/}
                  </td>

                  <td>{person.username}</td>
                  {/* <td>{person.age}</td> */}
                  {/* <td>{person.password}</td> */}
                  <td>{person.email}</td>
                  <td>{person.role}</td>

                  <td className='buttons'> 
                    <Link to={`/person/${person.id}/link-device`}>
                       <button>Add Devices</button>
                    </Link>

                    <button
                      onClick={() => handleDeletePerson(person.id)}
                      style={{ marginLeft: '10px', color: 'red' }}>
                      Delete
                    </button>
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No persons found.</p>
        )}
      </div>
    );
}

export default Person;
