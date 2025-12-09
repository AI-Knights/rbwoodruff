"""Email service for sending OTP and other notifications"""

from django.core.mail import send_mail
from django.conf import settings
from core.utils import generate_otp
from authentication.models import OTP


def send_otp_email(user):
    """
    Generate and send OTP to user email
    Returns the OTP instance
    """
    # Generate OTP
    otp_code = generate_otp()
    
    # Create OTP record
    otp_instance = OTP.objects.create(
        user=user,
        otp=otp_code
    )
    
    # Send email
    subject = 'Neworkx - Email Verification Code'
    message = f'''
    Hello {user.full_name},
    
    Your verification code is: {otp_code}
    
    This code will expire in {settings.OTP_VALIDITY_DURATION} minutes.
    
    If you didn't request this code, please ignore this email.
    
    Best regards,
    Neworkx Team
    '''
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
    
    return otp_instance


def send_password_reset_email(user, reset_link):
    """Send password reset email to user"""
    
    subject = 'Neworkx - Password Reset Request'
    message = f'''
    Hello {user.full_name},
    
    You requested to reset your password. Click the link below to reset it:
    
    {reset_link}
    
    This link will expire in 1 hour.
    
    If you didn't request this, please ignore this email.
    
    Best regards,
    Neworkx Team
    '''
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )


def send_payment_receipt_email(user, payment):
    """Send payment confirmation email"""
    
    subject = 'Neworkx - Payment Receipt'
    message = f'''
    Hello {user.full_name},
    
    Thank you for your payment!
    
    Receipt Number: {payment.receipt_number}
    Amount: ${payment.amount} {payment.currency}
    Status: {payment.status}
    Date: {payment.created_at.strftime('%Y-%m-%d %H:%M')}
    
    You can now access all platform features.
    
    Best regards,
    Neworkx Team
    '''
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )


def send_welcome_email(user):
    """Send welcome email after successful registration"""
    
    subject = 'Welcome to Neworkx!'
    message = f'''
    Hello {user.full_name},
    
    Welcome to Neworkx! We're excited to have you on board.
    
    Your account has been successfully created. You can now access:
    - Job search and applications
    - Training programs
    - Resume builder
    - And much more!
    
    Log in to get started: {settings.DOMAIN_URL}/login
    
    Best regards,
    The Neworkx Team
    '''
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
