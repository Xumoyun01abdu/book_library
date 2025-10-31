from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Book, CartItem, Favorite, UserProfile

@admin.register(Book)
class BookAdmin(ModelAdmin):
    list_display = ['title', 'author', 'genre', 'price', 'rating']
    list_filter = ['genre', 'created_at']
    search_fields = ['title', 'author']

@admin.register(CartItem)
class CartItemAdmin(ModelAdmin):
    list_display = ['user', 'book', 'quantity', 'added_at']
    list_filter = ['added_at']

@admin.register(Favorite)
class FavoriteAdmin(ModelAdmin):
    list_display = ['user', 'book', 'added_at']
    list_filter = ['added_at']

@admin.register(UserProfile)
class UserProfileAdmin(ModelAdmin):
    list_display = ['user', 'city', 'country', 'created_at']
    list_filter = ['created_at']
