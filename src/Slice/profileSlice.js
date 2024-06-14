import { createSlice } from "@reduxjs/toolkit";

const initialState = {
user:null
}

const userSlice =createSlice({
    name:"profile",
    initialState:initialState,
    reducers:{
         setUser(state , value){
             state.user = value.payload;
         }
    }
});
export const {setUser} = userSlice.actions;
export default userSlice.reducer