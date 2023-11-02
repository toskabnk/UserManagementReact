import XThemeProvider from "./XThemeProvider/XThemeProvider";
import AuthProvider from "./AuthProvider/AuthProvider"

const Providers = ({children}) => {
    return (
        <XThemeProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </XThemeProvider>
    )
}

export default Providers;
