"use strict";const data=[{id:1,imgUrl:"images/products/product_1.png",price:200,name:"Green Chair",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",material:"metal",color:"green"},{id:2,imgUrl:"images/products/product_2.png",price:149.99,name:"Orange Chair",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",material:"wood",color:"orange"},{id:3,imgUrl:"images/products/product_3.png",price:189.99,name:"Orange|| Chair",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",material:"metal",color:"orange"},{id:4,imgUrl:"images/products/product_4.png",price:170,name:"Colored Chair",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",material:"textile",color:"colored"},{id:5,imgUrl:"images/products/product_5.png",price:249.99,name:"White Chair",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",material:"wood",color:"white"},{id:6,imgUrl:"images/products/product_6.png",price:130,name:"Green|| Chair",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",material:"metal",color:"green"},{id:7,imgUrl:"images/products/product_7.png",price:100.99,name:"White|| Chair",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",material:"wood",color:"white"},{id:8,imgUrl:"images/products/product_8.png",price:139.99,name:"Red Chair",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",material:"wood",color:"red"}],appContainer=document.getElementById("app"),routes={"/":"main.html","/cart":"cart.html","/shop":"category.html","/product":"single-product.html","/contact":"contact.html"};function getTemplate(e,t){const a=new XMLHttpRequest;a.onreadystatechange=function(){appContainer.innerHTML=_.template(a.responseText)(t)},a.open("GET","./templates/"+e,!0),a.send()}function navigateTo(e){console.log(e),e.preventDefault();let t="";t=("I"===e.target.tagName?e.target.parentNode:e.target).getAttribute("href");let a=data;if(t.startsWith("/shop")){var i=t.split("?");t=i[0];const o=new URLSearchParams(i[1]),r=o.get("material"),n=o.get("color");r&&(a=_.filter(a,function(e){return e.material===r})),n&&(a=_.filter(a,function(e){return e.color===n}))}else t.startsWith("/cart")&&(i=localStorage.getItem("cart"),a=i?JSON.parse(i):[]);getTemplate(routes[t],{items:a}),window.history.pushState({},"",t)}function showProduct(e){const t=+e.target.getAttribute("data-id"),a=data.find(function(e){return e.id===t});let i=localStorage.getItem("reviews-"+t);i=i?JSON.parse(i):[],a.items=i,getTemplate("single-product.html",a)}function addToCart(e){e.preventDefault(),e.stopPropagation();const t=+e.target.getAttribute("data-id");let a=localStorage.getItem("cart");a=a?JSON.parse(a):[];var i,o,r=a.findIndex(function(e){return e.id===t});-1!==r?a[r].count+=1:({id:i,name:o,price:e,imgUrl:r}=data.find(function(e){return e.id===t}),a.push({id:i,name:o,price:e,imgUrl:r,count:1})),localStorage.setItem("cart",JSON.stringify(a))}function changeCartCount(e){console.log(e);const t=+e.target.getAttribute("data-id");var a=e.target.getAttribute("data-action");let i=localStorage.getItem("cart");i=JSON.parse(i);var o=i.findIndex(function(e){return e.id===t});if("increment"===a?i[o].count+=1:"decrement"===a&&--i[o].count,0===i[o].count)i.splice(o,1),e.path[3].remove();else{const n=e.target.parentNode.children[1];n.value=i[o].count;const s=e.path[2].nextElementSibling.children[0];s.innerHTML="$"+i[o].count*i[o].price}const r=document.getElementsByClassName("cart-total")[0];r.innerHTML="$"+_.sumBy(i,function(e){return e.price*e.count}),localStorage.setItem("cart",JSON.stringify(i))}function proceedToCheckout(e){e.preventDefault();var e=localStorage.getItem("cart");getTemplate("checkout.html",{items:e=JSON.parse(e)})}function validateForm(e){console.log(e);const t=document.getElementsByClassName("error")[0];return e.name.value.match(/[A-Z]{1}[a-z]+/)?e.email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)?e.phoneNumber.value.match(/^\+380[0-9]{9}$/)?!(t.innerText=""):!(t.innerText="Phone number is not valid!"):!(t.innerText="Email is not valid!"):!(t.innerText="Name should contain only letters!")}function proceedOrder(e){e.preventDefault(),validateForm(document.forms[0].elements)&&(showModal(),document.getElementsByClassName("contact_form")[0].reset(),localStorage.setItem("cart",[]))}function showModal(){document.getElementById("modal-text").innerText=`
  Your order is accepted.
  `;const e=document.getElementById("modal");e.style.display="block",setTimeout(function(){e.style.display="none"},2e3)}function addReview(e){var t=+e.target.getAttribute("data-id");let a=localStorage.getItem("reviews-"+t);a=a?JSON.parse(a):[];e=document.forms[0].elements,e={name:e.name.value,email:e.email.value,number:e.number.value,message:e.message.value,imageUrl:`images/reviews/review-${_.random(1,3)}.png`};a.push(e),localStorage.setItem("reviews-"+t,JSON.stringify(a)),document.getElementsByClassName("contact_form")[0].reset();const i=document.getElementsByClassName("review_list")[0],o=document.createElement("div");o.classList.add("review_item"),o.innerHTML=`
    <div class="media">
      <div class="d-flex">
        <img src="${e.imageUrl}" alt="" />
      </div>
      <div class="media-body">
        <h4>${e.name}</h4>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
      </div>
    </div>
    <p>
      ${e.message}
    </p>
  `,i.appendChild(o)}getTemplate("main.html",{items:data}),window.addEventListener("popstate",function(e){console.log(e);e=e.target.location.pathname;getTemplate(routes[e])});