const trending=document.querySelector('.trending')
const categories=document.querySelector('.hero-category')
const heroBlock=document.querySelector('.hero-block')
const main=document.querySelector('main')
const cartCount=document.querySelector('#cartCount')
const cart=document.querySelector('#cart')

const _baseUrl='https://fakestoreapi.com/products/'

async function getProducts(){
    const res=await fetch(_baseUrl)
    const data= await res.json()
    console.log(data);
    showProducts(data.slice(0,5))
    showCategories(data)
}
getProducts()

function showProducts(arr){
    trending.innerHTML=''
    for (const product of arr) {
        trending.innerHTML+=`
        <div class="card" style="width: 18rem; " onclick='getItemById(${product.id})'>
        <img class="card-img-top" src="${product.image}" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">${product.category}</p>
          <h6>${product.price}$</h6>
        </div>
      </div>
        `
    }
}
function showCategories(arr){
  let newCategories=[]

  const categoriesFilter=arr.filter(el=>{
      // console.log(el);
      if(el.category && !newCategories.includes(el.category)){
          newCategories.push(el.category)
      }
  })
  
  console.log(newCategories);

  categories.innerHTML=''
  for (const name of newCategories) {
      categories.innerHTML+=`<li>${name}</li>`
  }
}

async function getItemById(id){
  const res=await fetch(_baseUrl+id)
  const data= await res.json()
  console.log(data);
  showOneCard(data)
}

function showOneCard(obj){
  trending.innerHTML=''
  main.innerHTML=''
  heroBlock.innerHTML=''
  heroBlock.innerHTML+=`
  <div  class="card" style="width: 50%; ">
  <img class="card-img-top" src="${obj.image}" alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">${obj.title}</h5>
    <p class="card-text">${obj.description}</p>
    <h4>${obj.price}$</h4>
    <a href="#" onclick='addItemToCard(${obj.id})' class="btn btn-primary">Dabavit v korzinu</a>
  </div>
</div>
  `
}

let arrCart=[] 

async function addItemToCard(id) {
  const isItemInCart=arrCart.some(item=>item.id===id);

   if (!isItemInCart) {
      const res = await fetch(_baseUrl + id);
      const data = await res.json();
 
      console.log(data);
      let newData={...data, count:1}
      arrCart.push(newData);
      const cartData = JSON.stringify(arrCart);
      localStorage.setItem('cart', cartData);
      getItemFromCart()
      cartCount.innerHTML = arrCart.length;

   } else {
      console.log('Этот товар уже добавлен');
      getItemFromCart()

   }
}

function getItemFromCart(){
  const data=JSON.parse(localStorage.getItem('cart'))
  console.log(data, 'localStorage');
  arrCart = data || []
  cartCount.innerHTML = arrCart.length;
}
// getItemFromCart()

if(arrCart!==null){
  getItemFromCart()
  cartCount.innerHTML = arrCart.length
}

cart.onclick=()=>{
  trending.innerHTML=''
  main.innerHTML=''
  heroBlock.innerHTML=''
  showCart(arrCart)
}

function showCart(arr){
  heroBlock.innerHTML=''
  for (const item of arr) {
    heroBlock.innerHTML+=`
    <div class='d-flex justify-content-between width:800px'>
      <img src='${item.image}' style='max-width:7%;'/>
    <div>
        <h3>${item.title}</h3>
        <h5>${item.category}</h5>
    </div>
    <h1>${item.price*item.count}$</h1>
    <div>
       <button class="plus">+</button>
       <span>${item.count}</span>
       <button class="minus">-</button>
    </div>
    <button class="delete">X</button>
    </div>
    `
  }
  const totalBlock=document.createElement('h4')
  heroBlock.appendChild(totalBlock)
  const totalSumma=arr.reduce((total, el)=>el.price*el.count+total, 0)
  totalBlock.innerHTML=`Total price: ${totalSumma} $`

  const plusBtn=document.querySelectorAll('.plus')
  const minusBtn=document.querySelectorAll('.minus')
  const deleteBtn=document.querySelectorAll('.delete')

  plusBtn.forEach((btn, i) =>{
    btn.addEventListener('click',()=>{
      arr[i].count++
      showCart(arr)
    })
  })

  minusBtn.forEach((btn, i)=>{
    btn.addEventListener('click',()=>{
      if (arr[i].count > 0){
        arr[i].count--
        showCart(arr)
      }
    })
  })

  deleteBtn.forEach((btn, i)=>{
    btn.addEventListener('click',()=>{
      arr.splice(i)
      showCart(arr)
    })
  })
}