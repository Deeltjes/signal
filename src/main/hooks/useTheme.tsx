import { createContext, useContext } from "react"
import { Theme, defaultTheme } from "../../main/common/theme/Theme"

export const ThemeContext = createContext<Theme>(defaultTheme)
export const useTheme = () => useContext(ThemeContext)
