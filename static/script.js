// Sample Books Data
const BOOKS = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    cover: "https://via.placeholder.com/300x450?text=Midnight+Library",
    rating: 4.5,
    reviews: 2847,
    genre: "Fiction",
    description: "A dazzling novel about all the choices that go into a life well lived.",
    price: 16.99,
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    cover: "https://via.placeholder.com/300x450?text=Atomic+Habits",
    rating: 4.8,
    reviews: 5234,
    genre: "Self-Help",
    description: "Transform your life with tiny changes that deliver remarkable results.",
    price: 18.99,
  },
  {
    id: 3,
    title: "Project Hail Mary",
    author: "Andy Weir",
    cover: "https://via.placeholder.com/300x450?text=Project+Hail+Mary",
    rating: 4.7,
    reviews: 3891,
    genre: "Science Fiction",
    description: "A lone astronaut must save Earth from extinction in this thrilling adventure.",
    price: 17.99,
  },
  {
    id: 4,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    cover: "https://via.placeholder.com/300x450?text=Silent+Patient",
    rating: 4.4,
    reviews: 4156,
    genre: "Thriller",
    description: "A shocking psychological thriller with a twist you won't see coming.",
    price: 15.99,
  },
  {
    id: 5,
    title: "Educated",
    author: "Tara Westover",
    cover: "https://via.placeholder.com/300x450?text=Educated",
    rating: 4.6,
    reviews: 3421,
    genre: "Memoir",
    description: "A memoir about a young woman who leaves her survivalist family to pursue education.",
    price: 19.99,
  },
  {
    id: 6,
    title: "The Seven Husbands",
    author: "Taylor Jenkins Reid",
    cover: "https://via.placeholder.com/300x450?text=Seven+Husbands",
    rating: 4.5,
    reviews: 2934,
    genre: "Fiction",
    description: "The glamorous life of a reclusive Hollywood icon told through her marriages.",
    price: 18.99,
  },
]

// State Management
let favorites = JSON.parse(localStorage.getItem("favorites")) || []
let cart = JSON.parse(localStorage.getItem("cart")) || []
let currentGenre = "All"
let currentBook = null

// Import Bootstrap
const bootstrap = window.bootstrap

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderBooks()
  updateBadges()
})

// Render Books
function renderBooks() {
  const searchQuery = document.getElementById("searchInput").value.toLowerCase()
  const filtered = BOOKS.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery) || book.author.toLowerCase().includes(searchQuery)
    const matchesGenre = currentGenre === "All" || book.genre === currentGenre
    return matchesSearch && matchesGenre
  })

  const grid = document.getElementById("booksGrid")
  grid.innerHTML = filtered
    .map(
      (book) => `
        <div class="col-sm-6 col-lg-4 col-xl-3">
            <div class="book-card" onclick="openBookDetail(${book.id})">
                <img src="${book.cover}" alt="${book.title}" class="book-card-image">
                <div class="book-card-body">
                    <h6 class="book-card-title">${book.title}</h6>
                    <p class="book-card-author">${book.author}</p>
                    <div class="book-card-rating">
                        <i class="bi bi-star-fill"></i> ${book.rating} (${book.reviews})
                    </div>
                    <p class="book-card-price">$${book.price.toFixed(2)}</p>
                    <div class="book-card-buttons">
                        <button class="btn btn-outline-danger btn-sm" onclick="event.stopPropagation(); toggleFavoriteQuick(${book.id})">
                            <i class="bi bi-heart${favorites.includes(book.id) ? "-fill" : ""}"></i>
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); addToCartQuick(${book.id})">
                            <i class="bi bi-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  document.getElementById("bookCount").textContent = filtered.length
}

// Filter Books
function filterBooks() {
  renderBooks()
}

function filterByGenre(genre) {
  currentGenre = genre
  document.querySelectorAll(".genre-btn").forEach((btn) => btn.classList.remove("active"))
  event.target.classList.add("active")
  renderBooks()
}

// Book Detail Modal
function openBookDetail(bookId) {
  currentBook = BOOKS.find((b) => b.id === bookId)
  document.getElementById("bookTitle").textContent = currentBook.title
  document.getElementById("bookAuthor").textContent = currentBook.author
  document.getElementById("bookCover").src = currentBook.cover
  document.getElementById("bookGenre").textContent = currentBook.genre
  document.getElementById("bookDescription").textContent = currentBook.description
  document.getElementById("bookPrice").textContent = `$${currentBook.price.toFixed(2)}`
  document.getElementById("bookRating").innerHTML = `<i class="bi bi-star-fill"></i> ${currentBook.rating}`
  document.getElementById("bookReviews").textContent = `${currentBook.reviews} reviews`

  // Update button states
  const favBtn = document.getElementById("favBtn")
  if (favorites.includes(currentBook.id)) {
    favBtn.innerHTML = '<i class="bi bi-heart-fill"></i> Remove from Favorites'
    favBtn.classList.add("active")
  } else {
    favBtn.innerHTML = '<i class="bi bi-heart"></i> Add to Favorites'
    favBtn.classList.remove("active")
  }

  const modal = new bootstrap.Modal(document.getElementById("bookModal"))
  modal.show()
}

// Favorites Management
function toggleFavorite() {
  if (favorites.includes(currentBook.id)) {
    favorites = favorites.filter((id) => id !== currentBook.id)
  } else {
    favorites.push(currentBook.id)
  }
  localStorage.setItem("favorites", JSON.stringify(favorites))
  updateBadges()
  openBookDetail(currentBook.id)
}

function toggleFavoriteQuick(bookId) {
  if (favorites.includes(bookId)) {
    favorites = favorites.filter((id) => id !== bookId)
  } else {
    favorites.push(bookId)
  }
  localStorage.setItem("favorites", JSON.stringify(favorites))
  updateBadges()
  renderBooks()
}

// Cart Management
function addToCart() {
  const existingItem = cart.find((item) => item.id === currentBook.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.push({ ...currentBook, quantity: 1 })
  }
  localStorage.setItem("cart", JSON.stringify(cart))
  updateBadges()
  alert("Added to cart!")
}

function addToCartQuick(bookId) {
  const book = BOOKS.find((b) => b.id === bookId)
  const existingItem = cart.find((item) => item.id === bookId)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.push({ ...book, quantity: 1 })
  }
  localStorage.setItem("cart", JSON.stringify(cart))
  updateBadges()
}

function removeFromCart(bookId) {
  cart = cart.filter((item) => item.id !== bookId)
  localStorage.setItem("cart", JSON.stringify(cart))
  updateBadges()
  renderCart()
}

function updateQuantity(bookId, quantity) {
  const item = cart.find((item) => item.id === bookId)
  if (item) {
    item.quantity = Math.max(1, quantity)
    localStorage.setItem("cart", JSON.stringify(cart))
    updateBadges()
    renderCart()
  }
}

// Page Navigation
function showPage(page) {
  document.querySelectorAll(".page-content").forEach((p) => p.classList.add("d-none"))

  if (page === "home") {
    document.getElementById("homePage").classList.remove("d-none")
  } else if (page === "favorites") {
    document.getElementById("favoritesPage").classList.remove("d-none")
    renderFavorites()
  } else if (page === "cart") {
    document.getElementById("cartPage").classList.remove("d-none")
    renderCart()
  } else if (page === "profile") {
    document.getElementById("profilePage").classList.remove("d-none")
    updateProfileStats()
  }
}

// Render Favorites
function renderFavorites() {
  const favoriteBooks = BOOKS.filter((book) => favorites.includes(book.id))
  const grid = document.getElementById("favoritesGrid")
  const empty = document.getElementById("emptyFavorites")

  if (favoriteBooks.length === 0) {
    grid.innerHTML = ""
    empty.classList.remove("d-none")
  } else {
    empty.classList.add("d-none")
    grid.innerHTML = favoriteBooks
      .map(
        (book) => `
            <div class="col-sm-6 col-lg-4 col-xl-3">
                <div class="favorite-card">
                    <img src="${book.cover}" alt="${book.title}" class="favorite-card-image">
                    <div class="favorite-card-body">
                        <h6 class="favorite-card-title">${book.title}</h6>
                        <p class="favorite-card-author">${book.author}</p>
                        <p class="favorite-card-price">$${book.price.toFixed(2)}</p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-danger btn-sm flex-grow-1" onclick="toggleFavoriteQuick(${book.id})">
                                <i class="bi bi-heart-fill"></i> Remove
                            </button>
                            <button class="btn btn-primary btn-sm flex-grow-1" onclick="addToCartQuick(${book.id})">
                                <i class="bi bi-cart-plus"></i> Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }
}

// Render Cart
function renderCart() {
  const cartContainer = document.getElementById("cartItems")
  const emptyCart = document.getElementById("emptyCart")

  if (cart.length === 0) {
    cartContainer.innerHTML = ""
    emptyCart.classList.remove("d-none")
  } else {
    emptyCart.classList.add("d-none")
    cartContainer.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <img src="${item.cover}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-author">${item.author}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="quantity-control">
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="px-3">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="btn btn-sm btn-outline-danger ms-auto" onclick="removeFromCart(${item.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }

  updateCartSummary()
}

// Update Cart Summary
function updateCartSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = cart.length > 0 ? 5.0 : 0
  const total = subtotal + shipping

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`
  document.getElementById("shipping").textContent = `$${shipping.toFixed(2)}`
  document.getElementById("total").textContent = `$${total.toFixed(2)}`
}

// Update Profile Stats
function updateProfileStats() {
  document.getElementById("profileFavCount").textContent = favorites.length
  document.getElementById("profileCartCount").textContent = cart.length
}

// Update Badges
function updateBadges() {
  document.getElementById("favCount").textContent = favorites.length
  document.getElementById("cartCount").textContent = cart.length
}

// Checkout
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!")
    return
  }
  alert("Thank you for your purchase! Order placed successfully.")
  cart = []
  localStorage.setItem("cart", JSON.stringify(cart))
  updateBadges()
  renderCart()
}
