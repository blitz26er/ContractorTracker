var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://root:root@ds027799.mongolab.com:27799/contractor_tracker");

var PersonSchema = new Schema({
    name    : String
  , age     : Number
  , stories : [{ type: Schema.ObjectId, ref: 'Story'}]
});
var StorySchema = new Schema({
    _creator : { type: Schema.ObjectId, ref: 'Person' }
  , title    : String
});

var Story  = mongoose.model('Story', StorySchema);
var Person = mongoose.model('Person', PersonSchema);

var aaron = new Person({name: 'Aaron', age: 100});
aaron.save(function (err) {
  if (err) throw err;

  var story1 = new Story({
      title: "A man who cooked Nintendo"
    , _creator: aaron._id
  });

  story1.save(function (err) {
    if (err) throw err;

    Person.findOne({name: "Aaron"}).populate('stories')
            .exec(function (err, person) {
      if (err) throw err;
      console.log("person =", person);
      console.log("person.stories =", person.stories);
    })

    Story.findOne({title: /Nintendo/i}).populate('_creator')
            .exec(function (err, story) {
      if (err) throw err;
      console.log("story =", story);
    })
  });
});