import XthemeProvider from "./XThemeProvider";
import XthemeContext from "./XthemeContext";

const Providers = ({ children }) => {
    return (
        <XthemeProvider>
                    {children}
        </XthemeProvider>
    )
}

export default Providers;

export {
    XthemeContext,
}