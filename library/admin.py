from django.contrib import admin
from .models import Book, CartItem, Favorite, UserProfile

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'genre', 'price', 'rating']
    list_filter = ['genre', 'created_at']
    search_fields = ['title', 'author']

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'quantity', 'added_at']
    list_filter = ['added_at']

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'added_at']
    list_filter = ['added_at']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'city', 'country', 'created_at']
    list_filter = ['created_at']
