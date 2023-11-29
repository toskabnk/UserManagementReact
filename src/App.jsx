import './App.css'
import { Navbar } from './pages/Header'
import styled from 'styled-components';
import Routes from './routes/Routes';

export const StyledFlexFullCenter = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  height: ${props => (props.height ? props.height : '100vh;')};;
  background-color: #eeeeee;
`
function App() {
  return (
    <StyledFlexFullCenter height='100%'>
      <Navbar/>
      <Routes/> 
    </StyledFlexFullCenter>
  )
}

export default App
