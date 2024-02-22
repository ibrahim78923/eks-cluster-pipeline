import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {
    hidden: false
  }
}

const fullscreenSlice = createSlice({
  name: 'fullscreen',
  initialState,
  reducers: {
    fullscreen(state) {
      state.value.hidden = !state.value.hidden
    }
  }
})

export const { fullscreen } = fullscreenSlice.actions
export default fullscreenSlice.reducer
