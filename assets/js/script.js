// ======================
// VARIABLES
// ======================

// 1st: pull initial budgetItems/lastID from localStorage to set initial variables
//We will do this by saving to local storage which requires everything to be a string. Then when we return it we have to parse it out.
//in the chrome console you can use "localStorage.clear" to empty if you want

//If the budget item exists then grab it and parse "[]" otherwise return and empty array
let budgetItems = JSON.parse(localStorage.getItem("budgetItems")) || [] ;

let lastID = localStorage.getItem("lastID") || 0 ;


// ======================
// FUNCTIONS
// ======================

// 4th: function to update localStorage with latest budgetItems and latest lastID
// var sayHi = (name) => `Hi ${name}`;
// //is the same as this
// var sayHi = name => {
//     return `Hi ${name}`;
// };
//Avoid arrow functions if using object methods, or callbacks inside JQuery or constructors due to the THIS selector doesn't work.
const updateStorage = () => {
    localStorage.setItem("budgetItems", JSON.stringify(budgetItems));
    localStorage.setItem("lastID", lastID);
}

//Wierd scoping example
// for (var i =0; i < 5; i++) {
//     setTimeout(function() {
//         console.log(+i)
//     }, 50);
// }

// 5th: function to render budgetItems on table; each item should be rendered in this format:
const renderItems = items => {
    //If items array varible doesn't exist use the whole list
    if (!items) items = budgetItems;
    //A space in the selector means we are selecting the child of the parent #budgetItems
    const tbody = $("#budgetItems tbody");
    tbody.empty();
    //Now loop through our items array
    items.forEach(item => {
        const row = `<tr data-id=${item.id}><td>${item.date}</td><td>${item.name}</td><td>${item.category}</td><td>$${parseFloat(item.amount).toFixed(2)}</td><td>${item.notes}</td><td class="delete"><span>x</span></td></tr>`;
        tbody.append(row);
    });
    
    //.reduce will allow us to loop through an array and reduces it down to a single value for our total
    const total = items.reduce((accum, item) => accum + parseFloat(item.amount), 0);

    $("#total").text(`$${total.toFixed(2)}`);
}


// ======================
// MAIN PROCESS
// ======================
renderItems();


// 2nd: wire up click event on 'Enter New Budget Item' button to toggle display of form
$("#toggleFormButton, #hideForm").on("click", function() {
    const button = $("#toggleFormButton");
    const form = $("#addItemForm");

    form.toggle("slow", function() {
        if ($(this).is(":visible")) {
        //if visible
            button.text("Hide Form")
        } else {
            //if NOT visible
            button.text("Add New Budget Item")
        }
    });

})

// 3rd: wire up click event on 'Add Budget Item' button, gather user input and add item to budgetItems array
$("#addItem").on("click", function(event) {
    event.preventDefault();

    // (each item's object should include: id / date / name / category / amount / notes)... then clear the form
    const newItem = {
        //++Value increments the value BEFORE it stores it
        //Where as Value++ will give you the value BEFORE incrementing
        id: ++lastID,
        date: moment().format("lll"),
        name: $("#name").val().trim(),
        category: $("#category").val().trim(),
        amount: $("#amount").val().trim() || 5,
        notes: $("#notes").val().trim()
    }

    //Now clear the form and reset in one line of JS
    //.Val really only works for form values.
    $("input, select").val("");
    //Remember to push your new entry to the array!
    budgetItems.push(newItem);
    //update local storage
    updateStorage();
    //re-render the HTML to show the change
    renderItems();

})

// 6th: wire up change event on the category select menu, show filtered budgetItems based on selection
$("#categoryFilter").on("change", function() {
    const category = $(this).val();
    if (category) {
        const filteredItems = budgetItems.filter(item => item.category === category);
        renderItems(filteredItems);
    } else {
        renderItems();
    }
})

// 7th: wire up click event on the delete button of a given row; on click delete that budgetItem
//If we use event delagation all new items will also have working onClick buttons
$("#budgetItems").on("click", ".delete", function() {
    //Remember to convert the ID to an integer since HTML always returns strings
    const id = parseInt($(this).parents("tr").attr("data-id"));
    const remainingItems = budgetItems.filter(item => item.id !== id);
    budgetItems = remainingItems;
    updateStorage();
    renderItems();
    $("#categoryFilter").val("");
} );





