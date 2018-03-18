var app = new Vue({
  el: '#app',
  data: {
    priority: 0,
    items: [],
    text: '',
	url: '',
    show: 'all',
    drag: {},
	orderChange: false,
	orderTarget: ""
  },
  created: function() {
	  this.getItems();
  },
  computed: {
    activeItems: function() {
      return this.items.filter(function(item) {
	return !item.completed;
      });
    },
    filteredItems: function() {
      if (this.show === 'active')
	return this.items.filter(function(item) {
	  return !item.completed;
	});
      if (this.show === 'completed')
	return this.items.filter(function(item) {
	  return item.completed;
	});
      return this.items;
    },
  },
  methods: {
    addItem: function() {
		axios.post("/api/items", {
			priority: this.priority,
			text: this.text,
			url: this.url,
			completed: false
		}).then(response => {
			this.priority = "1";
			this.text = "";
			this.url = "";
			this.getItems();
			return true;
		}).catch(err => {
		});
	},
    completeItem: function(item) {
      axios.put("/api/items/" + item.id, {
		  text: item.text,
		  url: item.url,
		  completed: !item.completed,
		  orderChange: false,
	  }).then(response => {
		  return true,
	  }).catch(err => {
	  });
    },
    deleteItem: function(item) {
      axios.delete("/api/items/" + item.id).then(response => {
		  this.getItems();
		  return true;
	  }).catch(err => {
	  });
    },
	getItems: function() {
		axios.get("/api/items").then(response => {
			this.items = response.data;
			return true;
		}).catch( err => {
		});
	},
    deleteCompleted: function() {
      this.items = this.items.filter(function(item) {
	return !item.completed;
      });
    },
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      axios.put("/api/items/" + this.drag.id, {
		  text: this.drag.text,
		  completed: this.drag.completed,
		  orderChange: true,
		  orderTarget: item.id
	  }).then( response => {
		  this.getItems();
		  return true;
	  }).catch( err => {
	  });
    },
  }
});

