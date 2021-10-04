import './App.css';
import { Main } from './Components/Main/Main';
import { Header } from './Components/Header/Header'
import { Footer } from './Components/Footer/Footer'
import { Switch, Route, Redirect } from "react-router-dom";
import { About } from './Components/About/About'
import { useEffect, useState } from 'react';
import { Search } from './Components/Search/Search';
import { getUsers } from './Services/getUsers';

function App() {

  const [gridView, setGridView] = useState(false);
  const [users, setUsers] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);


  useEffect(() => {
    if (localStorage.getItem("reactBitPeopleProject#36232") === null) {
      getUsers().then((users) => {
        setUsers(users);
        setFilteredUsers(users);
        localStorage.setItem("reactBitPeopleProject#36232", JSON.stringify(users))
      });
    } else {
      setUsers(JSON.parse(localStorage.getItem("reactBitPeopleProject#36232")));
      setFilteredUsers(JSON.parse(localStorage.getItem("reactBitPeopleProject#36232")));
    }
  }, []);


  const onRefresh = () => {
    localStorage.removeItem("reactBitPeopleProject#36232")
    getUsers()
      .then((users) => {
        setUsers(users);
        setFilteredUsers(users);
        setInputValue("");
        localStorage.setItem("reactBitPeopleProject#36232", JSON.stringify(users))
        localStorage.setItem("lastModBitPeople2303", document.lastModified)
      });
  };


  const onTyping = (event) => {
    setInputValue(event.target.value);
    const filtUsers = users.filter(user => {
      const fullName = `${user.name.first} ${user.name.last}`;
      return fullName.toLowerCase().includes(event.target.value.toLowerCase())
    })
    setFilteredUsers(filtUsers);
  }


  const viewChange = () => {
    setGridView(!gridView)
  }


  return (
    <div className="App">
      <Header gridView={gridView} onRefresh={onRefresh} viewChange={viewChange} />
      <Search inputValue={inputValue} onChange={onTyping} />
      <Switch>
        <Route exact path='/home' component={() => <Main gridView={gridView} users={filteredUsers} inputValue={inputValue} />} />
        <Route exact path='/about' component={About} />
        <Redirect from='/' to='/home' />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
