const updateStorage = (data) => {
  localStorage.setItem('cocktails', JSON.stringify(data))
}

const addItem = (state, item) => {
  let items = state.items
  items.push(item)

  updateStorage(items)

  return {
    items: JSON.parse(JSON.stringify(items))
  }
}

const removeItem = (state, item) => {
  let index = -1
  for (let i = 0; i < state.items.length; i++) {
    if (state.items[i].title === item.title) {
      index = i
      break
    }
  }

  let items = state.items
  items.splice(index, 1)

  updateStorage(items)

  return {
    items: JSON.parse(JSON.stringify(items))
  }
}

const clearItems = () => {
  return {
    items: []
  }
}

export { addItem, removeItem, clearItems }
