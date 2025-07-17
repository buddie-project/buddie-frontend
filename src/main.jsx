import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";

/**
 * Ponto de entrada principal da aplicação React.
 * Renderiza o componente `App` dentro de `StrictMode` e `BrowserRouter`.
 * `StrictMode` ativa verificações adicionais e avisos para os descendentes.
 * `BrowserRouter` fornece a funcionalidade de roteamento baseada em URL.
 */
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </StrictMode>,
);
