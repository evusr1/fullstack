import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        notificationSet(state, action) {
            return action.payload
        },
        notificationRemove(state, action) {
            return ''
        }
    }
})


export const { notificationSet, notificationRemove } = notificationSlice.actions
export default notificationSlice.reducer
