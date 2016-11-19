export const ADD_ITEM = 'ADD_ITEM'
export const addItem = (item) => {
  return {
    type: ADD_ITEM,
    item: item
  }
}

export const REMOVE_ITEM = 'REMOVE_ITEM'
export const removeItem = (item) => {
  return {
    type: REMOVE_ITEM,
    item: item
  }
}

export const CLEAR_ITEMS = 'CLEAR_ITEMS'
export const clearItems = () => {
  return {
    type: CLEAR_ITEMS
  }
}
