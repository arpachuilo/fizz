const addItem = (state, item) => {
  let items = state.items
  items.push(item)

  return {
    items: items
  }
}

const removeItem = (state, item) => {
  let items = state.items
  let index = items.indexOf(item)
  items.splice(index, 1)

  return {
    items: items
  }
}

const clearItems = () => {
  return {
    items: []
  }
}

export { addItem, removeItem, clearItems }
