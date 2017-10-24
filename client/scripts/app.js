var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    var status = this.get('like');
    this.set('like', !status);
    return this.get('like');
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    // add code here
    // whenever the camparator or like status changes, we re-sort the movies
    this.on('change:comparator change:like', function() {
      this.sortByField(/*  what to put here */);
    });
    // add namespace, why sortByField 
  },

  comparator: 'title',

  sortByField: function(field) {
    // debugger;
    // change comparator
    this.comparator = field;
    // sort (which automatically involves comparator)
    this.sort();
  }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    this.model.on('change', this.render, this);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    // your code here
    this.model.toggleLike(); 
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    // add code here
    this.collection.on('change', this.render, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
