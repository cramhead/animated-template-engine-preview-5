items = new Meteor.Collection("items");

if (Meteor.isClient) {
    var addItem = function(evt, tmpl) {
        evt.preventDefault();
        $('#form').parsley('validate');

        if ($('#form').parsley('isValid')) {
            console.log('invalid');
        } else {
            console.log('valid');
        }

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

    Template.addItem.rendered = function() {
         $('#userInput').parsley({
            successClass: 'success',
            errorClass: 'error',
            errors: {
                classHandler: function(el) {
                    return $(el).closest('.control-group');
                },
                errorsWrapper: '<span class=\"help-inline\"></span>',
                errorElem: '<span></span>'
            }
        });
        // var txtUserName = this.find('#userInput');
        // $(txtUserName).parsley('addListener', {
        //     onFieldValidate: function(element) {
        //         console.log('validating');
        //         element.addClass('parsley-error');
        //         return false;
        //     },
        //     onFieldError: function(element) {
        //         element.addClass('parsley-error');
        //     }
        // });
    };

    Template.addItem.events({
        'click .add': addItem
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

            var queuedFn = function(next) {
                // refers to the elements array
                var el = elements.pop();
                var id = $(el).data('id');

                removeElement(id);

                next(); // perform the next task in the queue
            };
            var aniQ = $(this);
            var elements = $.find("li"); // get all the list items
            for (var i = elements.length - 1; i >= 0; i--) {
                $element = $(elements[i]);
                $element.addClass("identifyItemsToBeRemoved");
                button = $element.find('button');
                button.addClass('animatedButton');

                aniQ.delay(1000, 'remove')
                    .queue('remove', queuedFn);

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