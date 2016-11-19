import { addItem, removeItem, clearItems } from './list'
import { ADD_ITEM, REMOVE_ITEM, CLEAR_ITEMS } from '../actions'

const initialState = {
  items: [
    {
      'title': 'example',
      'directions': 'blah blah shake',
      'picture': '/path',
      'drinkware': 'cocktail glass',
      'served': 'on the rocks',
      'ingredients': {
        'alcohol': [
          {
            'ingredient': 'whiskey[rye]',
            'quantity': {
              'unit': 'ml',
              'amt': '5'
            }
          },
          {
            'ingredient': 'whiskey[bourbon]',
            'quantity': {
              'unit': 'ml',
              'amt': '5'
            }
          }
        ],
        'non-alcohol': [

        ],
        'garnish': [

        ],
        'misc': [

        ]
      }
    }
  ]
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
