let cart = []

function renderAfterBuying() {
  cart = []
  const main = document.querySelector('main');
  main.innerHTML = '';
  main.innerHTML = `
        <div class="container">
            <div class="row" id="items-row"></div>
        </div>
        
        <div id="alert-container"></div>
        <div class="contact-section">
            <button type="button" class="btn btn-primary btn-lg contact-container"  onclick="showForm()">Check Out</button>
        </div>`;
  renderItems(items); // Make sure 'items' is defined or passed as parameter
}


function renderItems(items)
{
    const row = document.querySelector("#items-row");

    items.forEach(item =>
    {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-4 d-flex";

        col.innerHTML = `
              <div class="card smaller-card d-flex flex-column ">
                  <img class="card-img-top" src="${item.img}">
                  <div class="card-body d-flex flex-column flex-grow-1">
                      <div>
                          <h2 class="card-title">${item.name}</h2>
                          <p class="card-text">${item.description}</p>
                      </div>

                      <!-- Push the button container to the bottom with spacing from content -->
                      <div class="d-flex align-items-center mt-auto" style="gap:10px; width:100%;">
                          <!-- Main Donate button, takes most of the space -->
                          <button type="button" class="btn btn-primary d-flex justify-content-between align-items-center flex-grow-1" onclick="addToCart(${item.id})">
                              <span>Donate €${item.price}</span>
                              <span id="counter-${item.id}" style="color: white; padding: 3px 10px; border-radius: 12px;">0</span>
                          </button>
                          <!-- Small decrement button on the right -->
                          <button type="button" class="btn btn-danger" style="width:50px;" onclick="decrement(${item.id})">–</button>
                      </div>
                  </div>
              </div>`;


        row.appendChild(col);
    });
}


renderItems(items);

function renderReceipt() {
  const rows = document.querySelector('.receipt-rows');
    
    // Clear old rows
    rows.innerHTML = '';
    let totalPrice = 0
    let itemesTodiscount = 0

    cart.forEach(item => {
        totalPrice += item.price * item.numUnit
        let itemPrice = item.price * item.numUnit
        itemesTodiscount += item.numUnit
        const row = document.createElement("div");
        row.className = "receipt-row";
        row.innerHTML = `
            <div class="receipt-img">
                <img src="${item.img}" alt="WinterBlanket">
            </div>
            <div class="its-price">
                <span>${itemPrice}€    X${item.numUnit}</span>
            </div>`;
        
        rows.appendChild(row);
    });

    let discount = 0
    if (itemesTodiscount >= 3)
    {
        discount = totalPrice * 0.30
        const row = document.createElement("div");
        row.className = "receipt-row";
        row.innerHTML = `
                <span>Discount 30%:</span>
                <span>${discount.toFixed(2)}€</span>`;
        rows.appendChild(row);
    }
    else
    {
        const row = document.createElement("div");
        row.className = "receipt-row";
        row.innerHTML = `
                <span>Discount above 3 items:</span>
                <span>-</span>`;
        rows.appendChild(row);
    }

    let Tax = 0
    Tax = totalPrice * 0.02
    {
        const row = document.createElement("div");
        row.className = "receipt-row";
        row.innerHTML = `
                <span>Tax 2%:</span>
                <span>${Tax.toFixed(2)}€</span>`;
        rows.appendChild(row);
    }
    {
        const row = document.createElement("div");
        row.className = "receipt-row";
        row.innerHTML = `
                <span>Total Price before:</span>
                <span>${totalPrice.toFixed(2)}€</span>`;
        rows.appendChild(row);
    }
    {
        totalPrice -= discount
        totalPrice += Tax
        console.log(Tax);
        const row = document.createElement("div");
        row.className = "receipt-row";
        row.innerHTML = `
                <span>Total Price after:</span>
                <span>${totalPrice.toFixed(2)}€</span>`;
        rows.appendChild(row);
    }

}



function addToCart(id) 
{
    const counterBox = document.getElementById(`counter-${id}`);
    let current = parseInt(counterBox.textContent, 10);
  
    const product = items.find(item => item.id === id);
  
    product.numUnit = current + 1;
    counterBox.textContent = product.numUnit;
  
    const existingProduct = cart.find(item => item.id === id);
  
    if (existingProduct) {
      console.log("already in cart");
      existingProduct.numUnit += 1; // update quantity
    } else {
      cart.push({ ...product, numUnit: 1 }); // push copy
    }
  
    console.log(cart);
  }


function decrement(id) {
    const counterBox = document.getElementById(`counter-${id}`);

    let current = parseInt(counterBox.textContent);
    const product = items.find((item) => item.id === id);
    if (current > 0)
    {
        product.numUnit = current - 1;
        const existingProduct = cart.find(item => item.id === id);
        console.log("decrementing");
        existingProduct.numUnit -= 1;
        if (existingProduct.numUnit === 0)
        {
            // Find index of the product
            const index = cart.findIndex(item => item.id === existingProduct.id);
            if (index !== -1)
            {
              cart.splice(index, 1); // remove 1 element at that index
            }
        }
    }
    counterBox.textContent = product.numUnit;
}


// form.js Enable Bootstrap form validation
function enableBootstrapValidation() {
    const forms = document.querySelectorAll('.needs-validation');
  
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        event.preventDefault(); // prevent default submission first
        event.stopPropagation();
  
        if (form.checkValidity()) {
          // Form is valid, show modal
          renderReceipt();
          const myModal = new bootstrap.Modal(document.getElementById('modal1'));
          myModal.show();
        } 
  
        form.classList.add('was-validated');
      });
    });
  }
  


  // Call the function when page loads
document.addEventListener('DOMContentLoaded', () => 
{
  enableBootstrapValidation();
});



  
  

  
function showForm() {

    // check if there is items in cart

    if (cart.length > 0)
    {
        const main = document.querySelector('main');
        main.innerHTML = '';
        
        // Create a container (Bootstrap-friendly)
        const container = document.createElement('div');
        container.className = 'container mt-5';
        
        // Inject your form HTML
        container.innerHTML = `
          <div class="modal fade " id="modal1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1>Thank you for donation</h1>
                    </div>
                    <div class="modal-body">
                        <div class="receipt-rows"></div>

                        <button type="button" class="btn btn-primary btn-lg contact-container"  data-bs-dismiss="modal" data-bs-target="#modal1" onclick="renderAfterBuying()">Continue donating</button>
                    </div>
                </div>
            </div>
          </div>
           <div class="contact-section">
                <div class="contact-container">
                    <form class="row g-3 needs-validation" novalidate>
                        <div class="col-md-6">
                          <label for="validationCustom01" class="form-label">First name</label>
                          <input type="text" class="form-control" id="validationCustom01"  required>
                          <div class="valid-feedback">
                            Looks good!
                            </div>
                        </div>
            
                        <div class="col-md-6">
                          <label for="validationCustom02" class="form-label">Last name</label>
                          <input type="text" class="form-control" id="validationCustom02"  required>
                          <div class="valid-feedback">
                            Looks good!
                          </div>
                        </div>
            
                        <div class="col-md-6">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" required>
                            <div class="invalid-feedback">Please enter a valid email.</div>
                        </div>
            
                        <div class="col-md-6">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" required minlength="6">
                            <div class="invalid-feedback">Password must be at least 6 characters.</div>
                        </div>
                        
                        <div class="col-md-12">
                            <label for="phone" class="form-label">Phone Number</label>
                            <input type="number" class="form-control" id="phone" pattern="\d+" required>
                            <div class="invalid-feedback">Please enter a valid phone number (digits only).</div>
                        </div>
            
                        <div class="col-md-5">
                            <label for="country" class="form-label">Country</label>
                            <select class="form-select" id="country" required>
                              <option value="" disabled selected>Choose...</option>
                              <option>Austria</option>
                              <option>Germany</option>
                              <option>USA</option>
                              <option>Other</option>
                            </select>
                            <div class="invalid-feedback">Please select a country.</div>
                        </div>
                        
                        <div class="col-md-5">
                            <label for="validationCustom03" class="form-label">City</label>
                            <input type="text" class="form-control" id="validationCustom03" 
                                   pattern="^[A-Za-z\s]+$" required>
                            <div class="invalid-feedback">
                                Please provide a valid city (letters only).
                            </div>
                        </div>
            
            
                       <div class="col-md-2">
                            <label for="validationCustom05" class="form-label">Zip</label>
                            <input type="text" class="form-control" id="validationCustom05" 
                                   required minlength="6">
                            <div class="invalid-feedback">
                                Please provide a valid zip (at least 6 characters).
                            </div>
                        </div>
                                    
                                    
                        <div class="col-12">
                          <button class="btn btn-primary" id="submit" type="submit"">Submit form</button>
                        </div>
                      </form>
                </div>
            </div>
        `;
        main.appendChild(container);
        enableBootstrapValidation();
    }
    else
    {
        // Show alert inside the page
        const alertContainer = document.getElementById('alert-container');
        alertContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                You have not donate anything!!
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }
    
}

