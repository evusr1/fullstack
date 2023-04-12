import { createSlice } from '@reduxjs/toolkit'

export const setNotification = (text, seconds) => {
    return dispatch => {
        dispatch(notificationSet(text))
        setTimeout(() => {
            dispatch(notificationRemove())
        }, seconds * 1000);
    }
}

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
