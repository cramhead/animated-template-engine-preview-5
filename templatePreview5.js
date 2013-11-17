items = new Meteor.Collection("items");

if (Meteor.isClient) {
    var addItem = function(evt, tmpl) {
        evt.preventDefault();
        var inputText = tmpl.find('#userInput').value;

        var insertCallback = function(err, result) {
            if (err) {
                console.log('error: ' + err.message);
            }
        };
        if (inputText) {
            items.insert({
                itemValue: inputText
            }, insertCallback);
        }
    };

    Template.list.listItems = function() {
        return items.find({}).fetch();
    };

    Template.list.events({
        'click .remove': function(evt, tmpl) {
            itemId = this._id;
            items.remove({
                _id: itemId
            });
        }
    });

    Template.addItem.events({
        'click .add': addItem,
        'click #addItem': addItem
    });

    UI.body.events({
        'click .removeQuick': function(evt, tmpl) {

            var removeAllCallback = function(err, result) {
                if (err) {
                    console.log("Error removing all: " + err.message);
                } 
            };

            var removeElement = function(elementId) {
                items.remove({
                    _id: elementId
                }, removeAllCallback);

            };
            var aniQ = $(this);
            var elements = $.find("li"); // get all the list items
            for (var i = elements.length - 1; i >= 0; i--) {
                $element = $(elements[i]);
                $element.addClass("shiftRight");

                aniQ.delay(1000, 'remove')
                    .queue('remove', function(next) {
                        // refers to the elements array
                        var el = elements.pop();
                        var id = $(el).data('id');

                        removeElement(id);

                        next(); // perform the next task in the queue
                    });

            }
            // start the queue
            aniQ.dequeue('remove');

        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}