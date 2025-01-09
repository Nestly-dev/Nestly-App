import React, { useState } from "react";
import UserContext from "./UserContext";


const UserContexProvider = ({children})=>{
    const [user, setUser] = useState(null)
    const [signedIn, setSignedIn] = useState(false)
    return(
        <UserContext.Provider value={{user, setUser, setSignedIn, signedIn}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContexProvider