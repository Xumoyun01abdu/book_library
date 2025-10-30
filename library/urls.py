from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('cart/', views.cart, name='cart'),
    path('favorites/', views.favorites, name='favorites'),
    path('profile/', views.profile, name='profile'),
    path('add-to-cart/<int:book_id>/', views.add_to_cart, name='add_to_cart'),
    path('remove-from-cart/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('update-cart/<int:item_id>/', views.update_cart_quantity, name='update_cart'),
    path('add-to-favorites/<int:book_id>/', views.add_to_favorites, name='add_to_favorites'),
    path('remove-from-favorites/<int:favorite_id>/', views.remove_from_favorites, name='remove_from_favorites'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('details/<int:book_id>/', views.book_detail, name='details'),
]
