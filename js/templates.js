const getResultHTML = (foodName, macros) => (
	`
	  <div class="dropdown">
	  <a href="#" class="foodName">${foodName}</a>
	    <div class="dropdown-content">
	    <strong><u>Macros</u></strong>
	    ${macros}
	    <button class="addBtn">Add</button>
	    </div>
	  </div>
	`;
);