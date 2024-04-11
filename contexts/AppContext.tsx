
import React, { createContext, useState } from "react"

type AppContext = {
    open: boolean,
    setOpen: (value: boolean) => void
    darkMode: boolean,
    setDarkMode: (value: boolean) => void
}
type Props = {
    children: React.ReactNode
}

export const AppContext = createContext<AppContext>({
    open: false,
    setOpen: (value: boolean) => undefined,
    darkMode: false,
    setDarkMode: (value: boolean) => undefined
})

export const AppContextProvider = ({ children }: Props) => {

    const [open, setOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const values = {
        open,
        setOpen,
        darkMode,
        setDarkMode
    }

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}