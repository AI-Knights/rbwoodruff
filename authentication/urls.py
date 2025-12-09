from django.urls import path
from .views import (
    RegisterView, SendOTPView, VerifyOTPView, LoginView, LogoutView,
    ProfileView, PasswordResetRequestView, PasswordResetConfirmView
)
from .payment_views import (
    CreatePaymentIntentView, ConfirmPaymentView, StripeWebhookView,
    PaymentHistoryView, DownloadReceiptView
)



urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('send-otp/', SendOTPView.as_view(), name='send_otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('password-reset-request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    
    # Payment
    path('payment/create-intent/', CreatePaymentIntentView.as_view(), name='create_payment_intent'),
    path('payment/confirm/', ConfirmPaymentView.as_view(), name='confirm_payment'),
    path('payment/webhook/', StripeWebhookView.as_view(), name='stripe_webhook'),
    path('payment/history/', PaymentHistoryView.as_view(), name='payment_history'),
    path('payment/receipt/<uuid:payment_id>/', DownloadReceiptView.as_view(), name='download_receipt'),
]