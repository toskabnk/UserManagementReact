import './App.css'
import { Navbar } from './pages/Header'
import styled from 'styled-components';
import Routes from './routes/Routes';

export const StyledFlexFullCenter = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: ${props => (props.height ? props.height : '100vh;')};;
  background-color: #eeeeee;
`
function App() {
  return (
    <StyledFlexFullCenter>
      <Navbar/>
      <Routes/> 
  </StyledFlexFullCenter>
  )
}

export default App
