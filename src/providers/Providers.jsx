import XThemeProvider from "./XThemeProvider/XThemeProvider";
import AuthProvider from "./AuthProvider/AuthProvider"
import { Provider } from "react-redux";
import { store } from "../redux/store";

const Providers = ({children}) => {
    return (
        <Provider store={store}>
            <XThemeProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </XThemeProvider>
        </Provider>
    )
}

export default Providers;
