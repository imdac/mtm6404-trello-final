function serialNumber (length) {
  const numbers = []

  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * (92 - 65)) + 65
    numbers.push(String.fromCharCode(randomNumber))
  }

  return numbers.join('')
}

const app = Vue.createApp({
  data: function () {
    return {
      lists: ['To Do', 'Doing', 'Done'],
      cards: [
        {
          id: 'VZQUSU',
          list: 'To Do',
          text: 'Create new card feature'
        },
        {
          id: 'GXRRMI',
          list: 'Doing',
          text: 'Create move card feature'
        },
        {
          id: 'QLDJYB',
          list: 'Done',
          text: 'Create display cards feature'
        }
      ]
    }
  },
  created: function () {
    const cards = localStorage.getItem('cards')

    if (cards) {
      this.cards = JSON.parse(cards)
    }
  },
  methods: {
    getCards: function (list) {
      return this.cards.filter(card => card.list === list)
    },
    updateList: function (id, list) {
      const card = this.cards.find(card => card.id === id)
      card.list = list
    },
    updateText: function (id, text) {
      const card = this.cards.find(card => card.id === id)
      card.text = text
    },
    createCard: function (list) {
      this.cards.push({
        id: serialNumber(6),
        list: list,
        text: ''
      })
    },
    deleteCard: function (id) {
      const card = this.cards.findIndex(card => card.id === id)
      this.cards.splice(card, 1)
    }
  },
  watch: {
    cards: {
      deep: true,
      handler: function (cards) {
        localStorage.setItem('cards', JSON.stringify(cards))
      }
    }
  }
})

app.component('trello-card', {
  props: ['lists', 'id', 'initialList', 'initialText'],
  data: function () {
    return {
      list: this.initialList,
      text: this.initialText
    }
  },
  template: `
  <div class="card">
    <div class="card-action">
      <select class="card-action-select" v-model="list" v-on:change="$emit('update-list', id, list)">
        <optgroup label="Move to:">
          <option v-for="list in lists">{{ list }}</option>
        </optgroup>
      </select>
      <button class="card-action-button" @click="$emit('delete-card', id)">&times;</button>
    </div>
    <textarea class="card-text" v-model="text" v-on:change="$emit('update-text', id, text)"></textarea>
  </div>
  `
})

app.component('trello-list', {
  props: ['list'],
  template: `
  <div class="list">
    <div class="list-header">
      <h2 class="list-title">{{ list }}</h2>
      <button class="list-button" @click="$emit('create-card', list)">+</button>
    </div>
    <slot></slot>
  </div>
  `
})

const vm = app.mount('#app')
