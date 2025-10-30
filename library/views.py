from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.http import require_POST
from .models import Book, CartItem, Favorite, UserProfile
from .forms import UserRegistrationForm, UserProfileForm

def home(request):
    books = Book.objects.all()
    genres = Book.GENRE_CHOICES
    
    genre = request.GET.get('genre')
    search = request.GET.get('search')
    
    if genre:
        books = books.filter(genre=genre)
    if search:
        books = books.filter(title__icontains=search) | books.filter(author__icontains=search)
    
    cart_count = 0
    favorites_count = 0
    
    if request.user.is_authenticated:
        cart_count = CartItem.objects.filter(user=request.user).count()
        favorites_count = Favorite.objects.filter(user=request.user).count()
    
    context = {
        'books': books,
        'genres': genres,
        'cart_count': cart_count,
        'favorites_count': favorites_count,
    }
    return render(request, 'library/home.html', context)

def book_detail(request, book_id):
    book = Book.objects.get(pk=book_id)
    context = {
        'book': book,
    }
    return render(request, 'library/book_detail.html', context)

@login_required(login_url='login')
def cart(request):
    cart_items = CartItem.objects.filter(user=request.user)
    total_price = sum(item.get_total_price() for item in cart_items)
    
    context = {
        'cart_items': cart_items,
        'total_price': total_price,
        'cart_count': cart_items.count(),
        'favorites_count': Favorite.objects.filter(user=request.user).count(),
    }
    return render(request, 'library/cart.html', context)


@login_required(login_url='login')
def favorites(request):
    favorites = Favorite.objects.filter(user=request.user).select_related('book')
    cart_count = CartItem.objects.filter(user=request.user).count()
    
    context = {
        'favorites': favorites,
        'cart_count': cart_count,
        'favorites_count': favorites.count(),
    }
    return render(request, 'library/favorites.html', context)


@login_required(login_url='login')
def profile(request):
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            return redirect('profile')
    else:
        form = UserProfileForm(instance=profile)
    
    cart_count = CartItem.objects.filter(user=request.user).count()
    favorites_count = Favorite.objects.filter(user=request.user).count()
    
    context = {
        'form': form,
        'profile': profile,
        'cart_count': cart_count,
        'favorites_count': favorites_count,
    }
    return render(request, 'library/profile.html', context)


@require_POST
@login_required(login_url='login')
def add_to_cart(request, book_id):
    book = Book.objects.get(id=book_id)
    cart_item, created = CartItem.objects.get_or_create(user=request.user, book=book)
    
    if not created:
        cart_item.quantity += 1
        cart_item.save()
    
    return redirect("home")


@require_POST
@login_required(login_url='login')
def remove_from_cart(request, item_id):
    cart_item = CartItem.objects.get(id=item_id, user=request.user)
    cart_item.delete()
    return redirect('cart')


@require_POST
@login_required(login_url='login')
def update_cart_quantity(request, item_id):
    cart_item = CartItem.objects.get(id=item_id, user=request.user)
    quantity = request.POST.get('quantity', 1)
    
    try:
        quantity = int(quantity)
        if quantity > 0:
            cart_item.quantity = quantity
            cart_item.save()
    except ValueError:
        pass
    
    return redirect('cart')


@require_POST
@login_required(login_url='login')
def add_to_favorites(request, book_id):
    book = Book.objects.get(id=book_id)
    favorite, created = Favorite.objects.get_or_create(user=request.user, book=book)
    
    return redirect('home')


@require_POST
@login_required(login_url='login')
def remove_from_favorites(request, favorite_id):
    favorite = Favorite.objects.get(id=favorite_id, user=request.user)
    favorite.delete()
    return redirect('favorites')


def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            UserProfile.objects.create(user=user)
            login(request, user)
            return redirect('home')
    else:
        form = UserRegistrationForm()
    
    return render(request, 'library/register.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'library/login.html', {'error': 'Invalid credentials'})
    
    return render(request, 'library/login.html')


def logout_view(request):
    logout(request)
    return redirect('home')
