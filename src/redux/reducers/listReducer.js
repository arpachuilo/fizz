import { addItem, removeItem, clearItems } from './list'
import { ADD_ITEM, REMOVE_ITEM, CLEAR_ITEMS } from '../actions'

let localData = localStorage.getItem('cocktails')

if (localData === null) {
  localData = []
} else {
  localData = JSON.parse(localData)
}

console.log(localData)

const initialState = {
  items: localData
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM: {
      return addItem(state, action.item)
    }
    case REMOVE_ITEM: {
      return removeItem(state, action.item)
    }
    case CLEAR_ITEMS: {
      return clearItems()
    }
  }
  return state
}
